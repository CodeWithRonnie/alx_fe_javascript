let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "The best way to predict the future is to invent it.", category: "Innovation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];


window.onload = () => {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) quotes = JSON.parse(savedQuotes);

  populateCategories();
  showRandomQuote();
};


function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").innerText = `"${randomQuote.text}" — ${randomQuote.category}`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);


function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  alert("Quote added successfully!");
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}


function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}


window.addEventListener("load", () => {
  const lastFilter = localStorage.getItem("selectedCategory");
  if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter;
  }
  showRandomQuote();
});


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
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
