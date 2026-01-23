import { setIntakeField, getState } from "../state.js";
import { handleIntakeSubmit } from "../controllers/intakeController.js";

export function renderIntakeWizardView(root) {
  const state = getState();

  let step = 1;

  function render() {
    root.innerHTML = `
      <section class="wizard">

        <div class="wizard-steps">
          <div class="wizard-step ${step === 1 ? "active" : ""}">1</div>
          <div class="wizard-step ${step === 2 ? "active" : ""}">2</div>
          <div class="wizard-step ${step === 3 ? "active" : ""}">3</div>
          <div class="wizard-step ${step === 4 ? "active" : ""}">4</div>
        </div>

        <div class="wizard-body">
          ${renderStep(step, state)}
        </div>

        <div class="wizard-nav">
          ${step > 1 ? `<button class="btn-secondary" id="wizard-back">Back</button>` : ""}
          ${step < 4 ? `<button class="btn-primary" id="wizard-next">Next</button>` : ""}
          ${step === 4 ? `<button class="btn-primary" id="wizard-submit">Analyze Roof</button>` : ""}
        </div>

        <div id="wizard-status"></div>
      </section>
    `;

    // Navigation
    if (step > 1) {
      document.getElementById("wizard-back").addEventListener("click", () => {
        step--;
        render();
      });
    }

    if (step < 4) {
      document.getElementById("wizard-next").addEventListener("click", () => {
        step++;
        render();
      });
    }

    if (step === 4) {
      document.getElementById("wizard-submit").addEventListener("click", () => {
        const files = document.getElementById("wizard-photos").files;
        handleIntakeSubmit(files);
      });
    }

    // Bind inputs
    bindInputs(step);
  }

  render();
}

function renderStep(step, state) {
  switch (step) {
    case 1:
      return `
        <h2>Property Details</h2>
        <label>Address</label>
        <input id="wizard-address" type="text" value="${state.intake.address || ""}" placeholder="123 Main St" />
        <label>Roof Age</label>
        <input id="wizard-roofAge" type="number" value="${state.intake.roofAge || ""}" placeholder="e.g. 15" />
      `;

    case 2:
      return `
        <h2>Roof Structure</h2>
        <label>Pitch</label>
        <input id="wizard-pitch" type="text" value="${state.intake.pitch || ""}" placeholder="e.g. 6/12" />
        <label>Valleys</label>
        <input id="wizard-valleys" type="number" value="${state.intake.valleys || ""}" placeholder="e.g. 3" />
        <label>Layers</label>
        <input id="wizard-layers" type="number" value="${state.intake.layers || ""}" placeholder="e.g. 1" />
      `;

    case 3:
      return `
        <h2>Material & Notes</h2>
        <label>Material</label>
        <input id="wizard-material" type="text" value="${state.intake.material || ""}" placeholder="e.g. Architectural Asphalt" />
        <label>Notes</label>
        <textarea id="wizard-notes" placeholder="Anything else?">${state.intake.notes || ""}</textarea>
      `;

    case 4:
      return `
        <h2>Upload Photos</h2>
        <input id="wizard-photos" type="file" accept="image/*" multiple />
        <p class="hero-visual-sub">Upload 3–6 photos for best accuracy.</p>
      `;
  }
}

function bindInputs(step) {
  const bind = (id, field) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", (e) => {
        setIntakeField(field, e.target.value);
      });
    }
  };

  if (step === 1) {
    bind("wizard-address", "address");
    bind("wizard-roofAge", "roofAge");
  }

  if (step === 2) {
    bind("wizard-pitch", "pitch");
    bind("wizard-valleys", "valleys");
    bind("wizard-layers", "layers");
  }

  if (step === 3) {
    bind("wizard-material", "material");
    bind("wizard-notes", "notes");
  }
}
