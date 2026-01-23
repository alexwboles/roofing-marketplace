// js/views/intakeWizard.js
// Fully functional 3‑step intake wizard

// --------------------------------------------------
// TEMPLATE
// --------------------------------------------------
const template = `
  <section class="intake-wizard">
    <h1>Roofing Project Intake</h1>

    <!-- Progress Indicators -->
    <div class="wizard-progress">
      <div class="dot" data-step="0"></div>
      <div class="dot" data-step="1"></div>
      <div class="dot" data-step="2"></div>
    </div>

    <!-- Steps -->
    <div class="wizard-steps">

      <!-- STEP 0 -->
      <div class="wizard-step" data-step="0">
        <h2>Step 1: Property Details</h2>
        <label>
          Property Address
          <input type="text" id="addressInput" placeholder="123 Main St" />
        </label>
        <label>
          City
          <input type="text" id="cityInput" placeholder="St. Augustine" />
        </label>
      </div>

      <!-- STEP 1 -->
      <div class="wizard-step" data-step="1">
        <h2>Step 2: Roof Information</h2>
        <label>
          Roof Material
          <select id="materialInput">
            <option value="">Select material</option>
            <option value="shingle">Shingle</option>
            <option value="metal">Metal</option>
            <option value="tile">Tile</option>
          </select>
        </label>
        <label>
          Estimated Roof Age
          <input type="number" id="ageInput" placeholder="Years" />
        </label>
      </div>

      <!-- STEP 2 -->
      <div class="wizard-step" data-step="2">
        <h2>Step 3: Contact Information</h2>
        <label>
          Full Name
          <input type="text" id="nameInput" placeholder="John Doe" />
        </label>
        <label>
          Phone Number
          <input type="tel" id="phoneInput" placeholder="555-123-4567" />
        </label>
      </div>

    </div>

    <!-- Navigation Buttons -->
    <div class="wizard-nav">
      <button type="button" id="prevStep">Previous</button>
      <button type="button" id="nextStep">Next</button>
      <button type="button" id="submitWizard">Submit</button>
    </div>
  </section>
`;

// --------------------------------------------------
// INITIALIZATION
// --------------------------------------------------
function initWizard(rootEl) {
  const steps = rootEl.querySelectorAll('.wizard-step');
  const dots = rootEl.querySelectorAll('.dot');

  const prevBtn = rootEl.querySelector('#prevStep');
  const nextBtn = rootEl.querySelector('#nextStep');
  const submitBtn = rootEl.querySelector('#submitWizard');

  let currentStep = 0;

  // -----------------------------
  // STEP RENDERING
  // -----------------------------
  function renderStep() {
    steps.forEach((el, i) => {
      el.style.display = i === currentStep ? 'block' : 'none';
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentStep);
    });

    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = currentStep === steps.length - 1 ? 'inline-block' : 'none';
  }

  // -----------------------------
  // VALIDATION HOOKS
  // -----------------------------
  function validateStep(step) {
    switch (step) {
      case 0:
        return rootEl.querySelector('#addressInput').value.trim() !== '';
      case 1:
        return rootEl.querySelector('#materialInput').value.trim() !== '';
      case 2:
        return rootEl.querySelector('#nameInput').value.trim() !== '';
      default:
        return true;
    }
  }

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) {
      alert('Please complete the required fields before continuing.');
      return;
    }
    currentStep++;
    renderStep();
  });

  prevBtn.addEventListener('click', () => {
    currentStep = Math.max(0, currentStep - 1);
    renderStep();
  });

  submitBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) {
      alert('Please complete the required fields.');
      return;
    }

    // Collect data
    const payload = {
      address: rootEl.querySelector('#addressInput').value.trim(),
      city: rootEl.querySelector('#cityInput').value.trim(),
      material: rootEl.querySelector('#materialInput').value.trim(),
      age: rootEl.querySelector('#ageInput').value.trim(),
      name: rootEl.querySelector('#nameInput').value.trim(),
      phone: rootEl.querySelector('#phoneInput').value.trim()
    };

    console.log('Wizard submitted:', payload);

    // TODO: integrate with your existing intake submission logic
    // e.g., handleIntakeSubmit(payload)
    alert('Intake submitted!');
  });

  // Initial render
  renderStep();
}

// --------------------------------------------------
// RENDER ENTRYPOINT
// --------------------------------------------------
export async function renderIntakeWizardView({ root }) {
  root.innerHTML = template;
  initWizard(root);
}

export const renderView = renderIntakeWizardView;
