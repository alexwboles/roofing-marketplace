import { getState } from "../state.js";

export function renderQuoteComparisonView(root) {
  const state = getState();
  const quotes = state.quotes || [];
  const report = state.analysis;

  if (!report) {
    root.innerHTML = `
      <section class="card">
        <h2>No Report Available</h2>
        <p>Complete the intake to generate your AI roof report.</p>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    <section class="dashboard">
      <div>
        <h2>Compare Roofer Quotes</h2>
        <p class="hero-visual-sub">
          AI estimated range:
          $${report.quote.estimatedLow.toLocaleString()} – 
          $${report.quote.estimatedHigh.toLocaleString()}
        </p>

        <div class="card">
          <h3>Quotes Received</h3>

          ${
            quotes.length === 0
              ? `<p>No quotes submitted yet. Roofers will respond soon.</p>`
              : `
            <table class="quote-table">
              <thead>
                <tr>
                  <th>Roofer</th>
                  <th>Price</th>
                  <th>Timeline</th>
                  <th>Warranty</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${quotes
                  .map(
                    (q) => `
                  <tr>
                    <td>${q.rooferName || "Roofer"}</td>
                    <td>$${q.price.toLocaleString()}</td>
                    <td>${q.timeline}</td>
                    <td>${q.warranty}</td>
                    <td>${q.notes || "—"}</td>
                    <td>
                      <button class="btn-primary accept-quote-btn" data-id="${q.id}">
                        Accept
                      </button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `
          }
        </div>
      </div>

      <div>
        <div class="card">
          <h3>Next Steps</h3>
          <ul>
            <li>Review each roofer’s quote carefully</li>
            <li>Compare price, timeline, and warranty</li>
            <li>Accept a quote to begin your project</li>
          </ul>
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll(".accept-quote-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const quoteId = btn.getAttribute("data-id");
      alert(`Quote ${quoteId} accepted (placeholder).`);
      // Next step: call /acceptQuote and navigate to project dashboard
    });
  });
}
