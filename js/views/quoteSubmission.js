import { getState } from "../state.js";
import { submitQuote } from "../controllers/quoteController.js";

export function renderQuoteSubmissionView(root) {
  const state = getState();
  const report = state.analysis;

  if (!report) {
    root.innerHTML = `
      <section class="card">
        <h2>No Active Lead</h2>
        <p>You must view a lead before submitting a quote.</p>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    <section class="intake">
      <h2>Submit Your Quote</h2>
      <p class="hero-visual-sub">For: ${report.address}</p>

      <label>Price ($)</label>
      <input id="quote-price" type="number" min="0" placeholder="e.g. 12400" />

      <label>Timeline</label>
      <input id="quote-timeline" type="text" placeholder="e.g. 2 days" />

      <label>Warranty</label>
      <input id="quote-warranty" type="text" placeholder="e.g. 10 years" />

      <label>Notes</label>
      <textarea id="quote-notes" placeholder="Anything the homeowner should know"></textarea>

      <button class="btn-primary" id="quote-submit-btn">Submit Quote</button>

      <div id="quote-status"></div>
    </section>
  `;

  document.getElementById("quote-submit-btn").addEventListener("click", () => {
    const payload = {
      price: document.getElementById("quote-price").value,
      timeline: document.getElementById("quote-timeline").value,
      warranty: document.getElementById("quote-warranty").value,
      notes: document.getElementById("quote-notes").value
    };

    submitQuote(payload);
  });
}
