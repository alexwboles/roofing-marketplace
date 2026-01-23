import { setIntakeField, getState } from "../state.js";
import { handleIntakeSubmit } from "../controllers/intakeController.js";

export function renderIntakeView(root) {
  const state = getState();

  root.innerHTML = `
    <section class="intake">
      <h2>Roof Intake Form</h2>
      <p class="hero-visual-sub">Upload photos and enter details to generate your AI roof report.</p>

      <label>Address</label>
      <input 
        id="intake-address" 
        type="text" 
        placeholder="123 Main St"
        value="${state.intake.address || ""}"
      />

      <label>Roof Age (years)</label>
      <input 
        id="intake-roofAge" 
        type="number" 
        min="0" 
        placeholder="e.g. 15"
        value="${state.intake.roofAge || ""}"
      />

      <label>Square Footage (optional)</label>
      <input 
        id="intake-squareFootage" 
        type="number" 
        min="0" 
        placeholder="e.g. 2400"
        value="${state.intake.squareFootage || ""}"
      />

      <label>Pitch</label>
      <input 
        id="intake-pitch" 
        type="text" 
        placeholder="e.g. 6/12"
        value="${state.intake.pitch || ""}"
      />

      <label>Number of Valleys</label>
      <input 
        id="intake-valleys" 
        type="number" 
        min="0" 
        placeholder="e.g. 3"
        value="${state.intake.valleys || ""}"
      />

      <label>Number of Layers</label>
      <input 
        id="intake-layers" 
        type="number" 
        min="1" 
        placeholder="e.g. 1"
        value="${state.intake.layers || ""}"
      />

      <label>Material</label>
      <input 
        id="intake-material" 
        type="text" 
        placeholder="e.g. Architectural Asphalt"
        value="${state.intake.material || ""}"
      />

      <label>Notes (optional)</label>
      <textarea 
        id="intake-notes" 
        placeholder="Anything else we should know?"
      >${state.intake.notes || ""}</textarea>

      <label>Upload Photos</label>
      <input 
        id="intake-photos" 
        type="file" 
        accept="image/*" 
        multiple
      />

      <button class="btn-primary" id="intake-submit-btn">Analyze Roof</button>

      <div id="intake-status"></div>
    </section>
  `;

  // -----------------------------
  // Field listeners → setIntakeField
  // -----------------------------
  document.getElementById("intake-address")
    .addEventListener("input", (e) => setIntakeField("address", e.target.value));

  document.getElementById("intake-roofAge")
    .addEventListener("input", (e) => setIntakeField("roofAge", e.target.value));

  document.getElementById("intake-squareFootage")
    .addEventListener("input", (e) => setIntakeField("squareFootage", e.target.value));

  document.getElementById("intake-pitch")
    .addEventListener("input", (e) => setIntakeField("pitch", e.target.value));

  document.getElementById("intake-valleys")
    .addEventListener("input", (e) => setIntakeField("valleys", e.target.value));

  document.getElementById("intake-layers")
    .addEventListener("input", (e) => setIntakeField("layers", e.target.value));

  document.getElementById("intake-material")
    .addEventListener("input", (e) => setIntakeField("material", e.target.value));

  document.getElementById("intake-notes")
    .addEventListener("input", (e) => setIntakeField("notes", e.target.value));

  // -----------------------------
  // Submit handler
  // -----------------------------
  document.getElementById("intake-submit-btn")
    .addEventListener("click", () => {
      const files = document.getElementById("intake-photos").files;
      handleIntakeSubmit(files);
    });
}
