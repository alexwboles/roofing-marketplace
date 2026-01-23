// js/views/intakeWizard.js
// Intake wizard view + initialization

// Example template – replace with your real markup
const template = `
  <section class="intake-wizard">
    <h1>Roofing Project Intake</h1>
    <div id="wizard-steps">
      <!-- step indicators -->
    </div>
    <form id="intakeWizardForm">
      <!-- your fields / steps go here -->
      <button type="button" id="prevStep">Previous</button>
      <button type="button" id="nextStep">Next</button>
      <button type="submit" id="submitWizard">Submit</button>
    </form>
  </section>
`;

// Core init logic – hook up events, state, etc.
function initWizard(rootEl) {
  const form = rootEl.querySelector('#intakeWizardForm');
  const nextBtn = rootEl.querySelector('#nextStep');
  const prevBtn = rootEl.querySelector('#prevStep');

  // TODO: wire your real step logic here
  let currentStep = 0;

  function goToStep(step) {
    currentStep = step;
    // update UI based on currentStep
  }

  nextBtn.addEventListener('click', () => {
    goToStep(currentStep + 1);
  });

  prevBtn.addEventListener('click', () => {
    goToStep(Math.max(0, currentStep - 1));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // handle final submit
    console.log('Wizard submitted');
  });

  // initial step
  goToStep(0);
}

// Standard render entrypoint used by viewEngine
export async function renderIntakeWizardView({ root }) {
  root.innerHTML = template;
  initWizard(root);
}

// Also expose a generic name for flexibility
export const renderView = renderIntakeWizardView;
