import { getState, setRole, updateIntake } from "../state.js";
import { handleIntakeSubmit } from "../controllers/intakeController.js";

export function renderIntakeView(root) {
  const state = getState();

  root.innerHTML = `
    <section class="section">
      <div class="form-card">
        <h2 class="section-title">Start your roof report</h2>
        <div class="form-group">
          <label class="label">Property address</label>
          <input id="intake-address" class="input" placeholder="123 Maple St" value="${state.intake.address}" />
        </div>

        <div class="form-group">
          <label class="label">Notes</label>
          <textarea id="intake-notes" class="textarea">${state.intake.notes}</textarea>
        </div>

        <div class="form-group">
          <label class="label">Who is this report for?</label>
          <div class="role-toggle">
            <button class="role-pill ${state.role === "homeowner" ? "active" : ""}" data-role="homeowner">My home</button>
            <button class="role-pill ${state.role === "roofer" ? "active" : ""}" data-role="roofer">My roofing client</button>
          </div>
        </div>

        <div class="form-group">
          <label class="label">Roof photos</label>
          <div class="upload-area" id="upload-area">
            <div class="upload-title">Click to upload</div>
            <input id="intake-photos" type="file" accept="image/*" multiple style="display:none" />
            <div id="upload-list">No photos added yet.</div>
          </div>
        </div>

        <button class="btn-primary" id="intake-submit-btn">Generate My Roof Report</button>
        <div class="status-banner info" id="intake-status">
          <span class="status-dot"></span>
          <span>We’ll analyze your photos and generate your report.</span>
        </div>
      </div>
    </section>
  `;

  document.getElementById("intake-address").addEventListener("input", (e) => {
    updateIntake({ address: e.target.value });
  });

  document.getElementById("intake-notes").addEventListener("input", (e) => {
    updateIntake({ notes: e.target.value });
  });

  document.querySelectorAll(".role-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const role = pill.dataset.role;
      setRole(role);
      document.querySelectorAll(".role-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  const uploadInput = document.getElementById("intake-photos");
  const uploadList = document.getElementById("upload-list");

  document.getElementById("upload-area").addEventListener("click", () => {
    uploadInput.click();
  });

  uploadInput.addEventListener("change", () => {
    const files = Array.from(uploadInput.files);
    updateIntake({ photos: files });
    uploadList.textContent = files.length ? files.map((f) => f.name).join(", ") : "No photos added yet.";
  });

  document.getElementById("intake-submit-btn").addEventListener("click", handleIntakeSubmit);
}
