let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "The best way to predict the future is to invent it.", category: "Innovation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) quotes = parsed;
    } catch (e) {}
  }
}

function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!display) return;
  const filterEl = document.getElementById("categoryFilter");
  const filter = filterEl ? filterEl.value : "all";
  const pool = filter === "all" ? quotes : quotes.filter(q => q.category === filter);
  if (!pool.length) {
    display.textContent = "No quotes available for this category.";
    return;
  }
  const i = Math.floor(Math.random() * pool.length);
  const q = pool[i];
  display.textContent = `"${q.text}" — ${q.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  if (!textEl || !catEl) return;
  const text = textEl.value.trim();
  const category = catEl.value.trim();
  if (!text || !category) return;
  quotes.push({ text, category });
  saveQuotes();
  textEl.value = "";
  catEl.value = "";
  populateCategories();
  showRandomQuote();
}

function createAddQuoteForm() {
  const addButton = document.getElementById("addQuoteBtn");
  if (addButton) addButton.addEventListener("click", addQuote);
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  const cats = Array.from(new Set(quotes.map(q => q.category)));
  select.innerHTML = '<option value="all">All Categories</option>';
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
  const saved = localStorage.getItem("selectedCategory");
  if (saved) select.value = saved;
}

function filterQuotes() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  const sel = select.value;
  localStorage.setItem("selectedCategory", sel);
  showRandomQuote();
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event?.target?.files?.[0];
  if (!file) {
    alert("No file selected.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("JSON must be an array of quote objects");
      const valid = imported.filter(it => it && typeof it.text === "string" && typeof it.category === "string");
      if (valid.length) {
        quotes.push(...valid);
        saveQuotes();
        populateCategories();
        alert(`Imported ${valid.length} quotes.`);
        showRandomQuote();
      } else {
        alert("No valid quote objects found in the file.");
      }
    } catch (err) {
      alert("Failed to import JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Server sync
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

function fetchServerQuotes() {
  fetch(SERVER_URL)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) return;
      let newQuotes = [];
      data.forEach(item => {
        if (item && item.title && item.body) {
          const exists = quotes.find(q => q.text === item.title);
          if (!exists) newQuotes.push({ text: item.title, category: item.body });
        }
      });
      if (newQuotes.length) {
        quotes.push(...newQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert(`Server synced: ${newQuotes.length} new quotes added.`);
      }
    })
    .catch(err => console.error("Server fetch failed:", err));
}

document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    try {
      const q = JSON.parse(last);
      const display = document.getElementById("quoteDisplay");
      if (display && q && q.text && q.category) display.textContent = `"${q.text}" — ${q.category}`;
      else showRandomQuote();
    } catch (e) {
      showRandomQuote();
    }
  } else {
    showRandomQuote();
  }

  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);

  const syncBtn = document.getElementById("syncNow");
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      fetchServerQuotes();
      alert("Syncing with server...");
    });
  }

  setInterval(fetchServerQuotes, 60000);
});
