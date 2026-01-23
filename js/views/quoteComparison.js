// js/views/quoteComparison.js
// LendingTree-style quote comparison

export async function renderQuoteComparisonView({ root }) {
  root.innerHTML = "";

  const container = document.createElement("section");
  container.className = "intake-wizard";

  const title = document.createElement("h1");
  title.textContent = "Compare roof quotes side by side";

  const subtitle = document.createElement("p");
  subtitle.textContent =
    "We’ve matched you with local roofers. Compare price, timeline, and warranty to choose the best fit.";

  const table = document.createElement("div");
  table.className = "quote-table";

  const storedQuotes = JSON.parse(sessionStorage.getItem("quotes") || "[]");

  const quotes =
    storedQuotes.length > 0
      ? storedQuotes
      : [
          {
            roofer: "Sunshine Roofing",
            price: 14800,
            timeline: "2 weeks",
            warranty: "25 years",
            rating: 4.8
          },
          {
            roofer: "Atlantic Coast Roofers",
            price: 13950,
            timeline: "3 weeks",
            warranty: "20 years",
            rating: 4.6
          }
        ];

  quotes.forEach((q) => {
    const row = document.createElement("div");
    row.className = "quote-row";

    row.innerHTML = `
      <div class="quote-roofer">${q.roofer}</div>
      <div class="quote-price">$${q.price.toLocaleString()}</div>
      <div class="quote-meta">${q.timeline} • ${q.warranty}</div>
      <div class="quote-rating">${q.rating ?? ""}${q.rating ? "★" : ""}</div>
    `;

    table.appendChild(row);
  });

  container.append(title, subtitle, table);
  root.appendChild(container);
}

export const renderView = renderQuoteComparisonView;
