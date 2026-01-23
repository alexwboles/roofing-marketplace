import { getState } from "../state.js";
import { navigateTo } from "../router.js";

export function renderHomeownerDashboardView(root) {
  const state = getState();
  const report = state.analysis;

  if (!report) {
    root.innerHTML = `
      <section class="dashboard">
        <div class="card">
          <h2>No Report Yet</h2>
          <p>Complete the intake to generate your AI roof report.</p>
        </div>
      </section>
    `;
    return;
  }

  const { address, photosAnalyzed, roofModel, quote, findings, summary } = report;

  root.innerHTML = `
    <section class="dashboard">
      <div>
        <h2>AI Roof Report</h2>

        <div class="card">
          <h3>Property</h3>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Photos analyzed:</strong> ${photosAnalyzed}</p>
          <button class="btn-primary" id="compare-quotes-btn">Compare Quotes</button>
        </div>

        <div class="card">
          <h3>Roof Geometry</h3>
          <p><strong>Square footage:</strong> ${roofModel.sqFt} sq ft</p>
          <p><strong>Pitch:</strong> ${roofModel.pitch}</p>
          <p><strong>Facets:</strong> ${roofModel.facets}</p>
          <p><strong>Valleys:</strong> ${roofModel.valleys}</p>
          <p><strong>Ridges:</strong> ${roofModel.ridges}</p>
          <p><strong>Layers:</strong> ${roofModel.layers}</p>
          <p><strong>Material detected:</strong> ${roofModel.materialDetected}</p>
          <p><strong>Waste factor:</strong> ${roofModel.wasteFactor}%</p>
          <p><strong>Complexity:</strong> ${roofModel.complexity}</p>
        </div>

        <div class="card">
          <h3>Condition</h3>
          <p><strong>Condition score:</strong> ${roofModel.conditionScore}/100</p>
          <p><strong>Status:</strong> ${roofModel.conditionLabel}</p>
          <p><strong>Summary:</strong> ${summary}</p>
        </div>

        <div class="card">
          <h3>Estimated Replacement Cost</h3>
          <p><strong>Estimated range:</strong> $${quote.estimatedLow.toLocaleString()} – $${quote.estimatedHigh.toLocaleString()}</p>
          <p><strong>Confidence:</strong> ${(quote.confidence * 100).toFixed(0)}%</p>

          <h4>Breakdown</h4>
          <ul>
            <li>Materials: $${quote.breakdown.materials.toLocaleString()}</li>
            <li>Labor: $${quote.breakdown.labor.toLocaleString()}</li>
            <li>Dumpster: $${quote.breakdown.dumpster.toLocaleString()}</li>
            <li>Misc: $${quote.breakdown.misc.toLocaleString()}</li>
          </ul>
        </div>

        <div class="card">
          <h3>AI Findings</h3>
          <ul>
            ${findings.map(f => `<li>${f}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div>
        <div class="card">
          <h3>Next Steps</h3>
          <ul>
            <li>Review your AI roof report</li>
            <li>Compare quotes from verified roofers</li>
            <li>Choose a roofer and schedule your project</li>
          </ul>
        </div>
      </div>
    </section>
  `;

  const compareBtn = document.getElementById("compare-quotes-btn");
  if (compareBtn) {
    compareBtn.addEventListener("click", () => {
      navigateTo("quoteComparison");
    });
  }
}
