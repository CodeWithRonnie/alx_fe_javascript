let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "The best way to predict the future is to invent it.", category: "Innovation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

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
}

function displayRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!display) return;
  const filterEl = document.getElementById("categoryFilter");
  const filter = filterEl ? filterEl.value : "all";
  const pool = filter === "all" ? quotes : quotes.filter(q => q.category === filter);
  if (!pool.length) {
    display.textContent = "No quotes available.";
    return;
  }
  const i = Math.floor(Math.random() * pool.length);
  const q = pool[i];
  display.textContent = `"${q.text}" — ${q.category}`;
}

function showRandomQuote() {
  displayRandomQuote();
}

function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  if (!textEl || !catEl) return;
  const text = textEl.value.trim();
  const category = catEl.value.trim();
  if (!text || !category) return;
  quotes.push({ text, category });
  textEl.value = "";
  catEl.value = "";
  populateCategories();
  displayRandomQuote();
}

function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");
  container.innerHTML = '';
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  const addBtn = document.createElement("button");
  addBtn.id = "addQuoteBtn";
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);
  container.appendChild(inputText);
  container.appendChild(document.createElement("br"));
  container.appendChild(inputCategory);
  container.appendChild(document.createElement("br"));
  container.appendChild(addBtn);
}

document.addEventListener("DOMContentLoaded", function() {
  populateCategories();
  createAddQuoteForm();
  displayRandomQuote();
  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) newQuoteBtn.addEventListener("click", displayRandomQuote);
  const categorySelect = document.getElementById("categoryFilter");
  if (categorySelect) categorySelect.addEventListener("change", displayRandomQuote);
});
