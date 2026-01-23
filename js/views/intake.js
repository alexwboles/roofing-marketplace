import { setIntakeField, getState } from "../state.js";
import { handleIntakeSubmit } from "../controllers/intakeController.js";

export function renderIntakeView(root) {
  const state = getState();

  root.innerHTML = `
    <section class="intake intake-polished">

      <div class="intake-header">
        <h2>Roof Intake</h2>
        <p class="hero-visual-sub">
          Upload photos and enter basic details.  
          Our AI will analyze your roof and generate a full report.
        </p>
      </div>

      <div class="intake-section">
        <h3>Property Details</h3>

        <label>Address</label>
        <input 
          id="intake-address" 
          type="text" 
          placeholder="123 Main St, City, State"
          value="${state.intake.address || ""}"
        />
        <small class="input-hint">Full address helps us match satellite imagery.</small>

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
      </div>

      <div class="intake-section">
        <h3>Roof Structure</h3>

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
      </div>

      <div class="intake-section">
        <h3>Additional Notes</h3>

        <textarea 
          id="intake-notes" 
          placeholder="Anything else we should know?"
        >${state.intake.notes || ""}</textarea>
      </div>

      <div class="intake-section">
        <h3>Upload Photos</h3>

        <input 
          id="intake-photos" 
          type="file" 
          accept="image/*" 
          multiple
        />
        <small class="input-hint">Upload 3–6 photos for best accuracy.</small>
      </div>

      <button class="btn-primary intake-submit" id="intake-submit-btn">
        Analyze Roof
      </button>

      <div id="intake-status" class="intake-status"></div>

    </section>
  `;

  // -----------------------------
  // Field listeners → setIntakeField
  // -----------------------------
  const bind = (id, field) => {
    document.getElementById(id).addEventListener("input", (e) => {
      setIntakeField(field, e.target.value);
    });
  };

  bind("intake-address", "address");
  bind("intake-roofAge", "roofAge");
  bind("intake-squareFootage", "squareFootage");
  bind("intake-pitch", "pitch");
  bind("intake-valleys", "valleys");
  bind("intake-layers", "layers");
  bind("intake-material", "material");
  bind("intake-notes", "notes");

  // -----------------------------
  // Submit handler
  // -----------------------------
  document.getElementById("intake-submit-btn")
    .addEventListener("click", () => {
      const files = document.getElementById("intake-photos").files;
      handleIntakeSubmit(files);
    });
}
