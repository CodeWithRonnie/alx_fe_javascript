const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "The best way to predict the future is to invent it.", category: "Innovation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function displayRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  const filteredCategory = localStorage.getItem("selectedCategory") || "all";
  const filteredQuotes = filteredCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === filteredCategory);

  if (filteredQuotes.length === 0) {
    display.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  display.textContent = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    displayRandomQuote();
  }
}

function populateCategories() {
  const filterSelect = document.getElementById("categoryFilter");
  const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category))];
  filterSelect.innerHTML = uniqueCategories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) filterSelect.value = savedCategory;
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Invalid JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("exportJson").addEventListener("click", exportToJsonFile);

window.onload = function() {
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").textContent = `"${quote.text}" — ${quote.category}`;
  } else {
    displayRandomQuote();
  }
};

// Optional: Simulate server sync
async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();
    if (serverData.length) {
      console.log("Server data synced");
    }
  } catch (error) {
    console.log("Server sync failed");
  }
}
setInterval(syncWithServer, 10000);
