import { getState, setRole, updateIntake } from "../state.js";
import { handleIntakeSubmit } from "../controllers/intakeController.js";

export function renderIntakeView(root) {
  const state = getState();

  root.innerHTML = `
    <section class="intake">
      <h2>Roof Intake Form</h2>
      <p class="hero-visual-sub">
        Add your address, upload multiple roof photos, and tell us about the roof. We’ll estimate key details using AI and satellite imagery.
      </p>

      <div class="intake-grid">
        <div>
          <label for="intake-address">Property address</label>
          <input
            id="intake-address"
            type="text"
            placeholder="123 Maple St, St. Augustine, FL"
            value="${state.intake.address || ""}"
          />
        </div>

        <div>
          <label for="intake-role">I am a...</label>
          <select id="intake-role">
            <option value="homeowner" ${state.role === "homeowner" ? "selected" : ""}>Homeowner</option>
            <option value="roofer" ${state.role === "roofer" ? "selected" : ""}>Roofer</option>
          </select>
        </div>

        <div>
          <label for="intake-roof-age">Roof age (years)</label>
          <input
            id="intake-roof-age"
            type="number"
            min="0"
            placeholder="e.g. 18"
            value="${state.intake.roofAge || ""}"
          />
        </div>

        <div>
          <label for="intake-sqft">Roof square footage</label>
          <input
            id="intake-sqft"
            type="number"
            min="0"
            placeholder="e.g. 2400"
            value="${state.intake.squareFootage || ""}"
          />
        </div>

        <div>
          <label for="intake-pitch">Pitch</label>
          <input
            id="intake-pitch"
            type="text"
            placeholder="e.g. 6/12"
            value="${state.intake.pitch || ""}"
          />
        </div>

        <div>
          <label for="intake-valleys">Number of valleys</label>
          <input
            id="intake-valleys"
            type="number"
            min="0"
            placeholder="e.g. 4"
            value="${state.intake.valleys || ""}"
          />
        </div>

        <div>
          <label for="intake-layers">Number of shingle layers</label>
          <input
            id="intake-layers"
            type="number"
            min="1"
            placeholder="e.g. 1"
            value="${state.intake.layers || ""}"
          />
        </div>

        <div>
          <label for="intake-material">Roof material</label>
          <input
            id="intake-material"
            type="text"
            placeholder="e.g. Architectural asphalt"
            value="${state.intake.material || ""}"
          />
        </div>
      </div>

      <div>
        <label for="intake-photos">Roof photos (multiple)</label>
        <input
          id="intake-photos"
          type="file"
          accept="image/*"
          multiple
        />
        <div id="intake-photos-count" class="hero-visual-sub">
          ${state.intake.photosCount || 0} photo(s) selected
        </div>
      </div>

      <div>
        <label for="intake-notes">Anything else we should know?</label>
        <textarea
          id="intake-notes"
          placeholder="Storm history, leaks, prior repairs, insurance notes..."
        >${state.intake.notes || ""}</textarea>
      </div>

      <button class="btn-primary" id="intake-submit">Analyze Roof</button>

      <div id="intake-status"></div>
    </section>
  `;

  document.getElementById("intake-address").addEventListener("input", (e) => {
    updateIntake({ address: e.target.value });
  });

  document.getElementById("intake-role").addEventListener("change", (e) => {
    setRole(e.target.value);
  });

  document.getElementById("intake-roof-age").addEventListener("input", (e) => {
    updateIntake({ roofAge: e.target.value });
  });

  document.getElementById("intake-sqft").addEventListener("input", (e) => {
    updateIntake({ squareFootage: e.target.value });
  });

  document.getElementById("intake-pitch").addEventListener("input", (e) => {
    updateIntake({ pitch: e.target.value });
  });

  document.getElementById("intake-valleys").addEventListener("input", (e) => {
    updateIntake({ valleys: e.target.value });
  });

  document.getElementById("intake-layers").addEventListener("input", (e) => {
    updateIntake({ layers: e.target.value });
  });

  document.getElementById("intake-material").addEventListener("input", (e) => {
    updateIntake({ material: e.target.value });
  });

  document.getElementById("intake-notes").addEventListener("input", (e) => {
    updateIntake({ notes: e.target.value });
  });

  const photosInput = document.getElementById("intake-photos");
  const photosCountEl = document.getElementById("intake-photos-count");

  photosInput.addEventListener("change", () => {
    const count = photosInput.files ? photosInput.files.length : 0;
    updateIntake({ photosCount: count });
    photosCountEl.textContent = `${count} photo(s) selected`;
  });

  document.getElementById("intake-submit").addEventListener("click", () => {
    handleIntakeSubmit(photosInput.files || []);
  });
}
