import { getState, setRole, updateIntake } from "../state.js";
import { handleIntakeSubmit } from "../controllers/intakeController.js";

export function renderIntakeView(root) {
  const state = getState();

  root.innerHTML = `
    <section class="section">
      <div class="form-card">
        <h2 class="section-title">Start your roof report</h2>
        <p class="section-subtitle">
          Tell us where the roof is, upload a few photos, and choose whether this is for your own home or a client.
        </p>
        <div class="form-grid">
          <div>
            <div class="form-group">
              <label class="label" for="intake-address">Property address</label>
              <input
                id="intake-address"
                class="input"
                type="text"
                placeholder="123 Maple St, St. Augustine, FL"
                value="${state.intake.address || ""}"
              />
              <div class="helper-text">
                We’ll use this to contextualize weather, age, and typical roof types in your area.
              </div>
            </div>

            <div class="form-group">
              <label class="label" for="intake-notes">Anything we should know?</label>
              <textarea
                id="intake-notes"
                class="textarea"
                placeholder="Recent storms, leaks, age of roof, insurance claim details..."
              >${state.intake.notes || ""}</textarea>
            </div>

            <div class="form-group">
              <label class="label">Who is this report for?</label>
              <div class="role-toggle">
                <button
                  type="button"
                  class="role-pill ${state.role === "homeowner" ? "active" : ""}"
                  data-role="homeowner"
                >
                  <span>My home</span>
                </button>
                <button
                  type="button"
                  class="role-pill ${state.role === "roofer" ? "active" : ""}"
                  data-role="roofer"
                >
                  <span>My roofing client</span>
                </button>
              </div>
              <div class="helper-text">
                This helps us tailor the report for either homeowner clarity or roofer-level detail.
              </div>
            </div>
          </div>

          <div>
            <div class="form-group">
              <label class="label">Roof photos</label>
              <div class="upload-area" id="upload-area">
                <div class="upload-title">Drag & drop or click to upload</div>
                <div class="upload-sub">
                  Add clear photos of each side of the roof, plus any close-ups of damage.
                </div>
                <input
                  id="intake-photos"
                  type="file"
                  accept="image/*"
                  multiple
                  style="display:none"
                />
                <div class="upload-list" id="upload-list">
                  ${state.intake.photos.length === 0
                    ? "No photos added yet."
                    : state.intake.photos.map((p, i) => `Photo ${i + 1}`).join(", ")}
                </div>
              </div>
            </div>

            <div class="form-group">
              <button class="btn-primary" id="intake-submit-btn">
                Generate My Roof Report
              </button>
            </div>

            <div class="status-banner info" id="intake-status">
              <span class="status-dot"></span>
              <span>We’ll analyze your photos and generate a roofer-ready summary in a few minutes.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const addressEl = document.getElementById("intake-address");
  const notesEl = document.getElementById("intake-notes");
  const uploadArea = document.getElementById("upload-area");
  const uploadInput = document.getElementById("intake-photos");
  const uploadList = document.getElementById("upload-list");
  const rolePills = document.querySelectorAll(".role-pill");
  const submitBtn = document.getElementById("intake-submit-btn");

  addressEl?.addEventListener("input", () => {
    updateIntake({ address: addressEl.value });
  });

  notesEl?.addEventListener("input", () => {
    updateIntake({ notes: notesEl.value });
  });

  rolePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const role = pill.getAttribute("data-role");
      if (!role) return;
      setRole(role);
      rolePills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  uploadArea?.addEventListener("click", () => {
    uploadInput?.click();
  });

  uploadInput?.addEventListener("change", () => {
    const files = Array.from(uploadInput.files || []);
    updateIntake({ photos: files });
    if (files.length === 0) {
      uploadList.textContent = "No photos added yet.";
    } else {
      uploadList.textContent = files.map((f) => f.name).join(", ");
    }
  });

  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    handleIntakeSubmit();
  });
}
