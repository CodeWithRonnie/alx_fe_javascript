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
      if (Array.isArray(parsed)) {
        quotes = parsed;
      }
    } catch (e) {}
  }
}

function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!display) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  display.textContent = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote(text, category) {
  quotes.push({ text, category });
  saveQuotes();
  showRandomQuote();
}

function createAddQuoteForm() {
  const container = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", function() {
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    if (text && category) {
      addQuote(text, category);
      textInput.value = "";
      categoryInput.value = "";
    }
  });

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);
  document.body.appendChild(container);
}

document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  createAddQuoteForm();
  const button = document.getElementById("newQuote");
  if (button) button.addEventListener("click", showRandomQuote);
  showRandomQuote();
});
