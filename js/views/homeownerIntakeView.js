// js/views/homeownerIntakeView.js
import { upsertHomeownerUser, createProject } from '../services/projects.js';
import { navigate, currentUser, currentProjectId as cpId } from '../app.js';

export function renderHomeownerIntakeView() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="intake-hero">
      <h1>Get competing roof quotes in minutes</h1>
      <p>One simple form. Roofers compete for your business.</p>
    </section>

    <form id="intake-form" class="card intake-form">
      <h2>Your info</h2>
      <div class="grid-2">
        <div>
          <label>Full name</label>
          <input type="text" id="intake-name" required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" id="intake-email" required />
        </div>
        <div>
          <label>Mobile phone</label>
          <input type="tel" id="intake-phone" required />
        </div>
      </div>

      <h2>Property</h2>
      <div class="grid-2">
        <div>
          <label>Street address</label>
          <input type="text" id="intake-address" required />
        </div>
        <div>
          <label>City</label>
          <input type="text" id="intake-city" required />
        </div>
        <div>
          <label>State</label>
          <input type="text" id="intake-state" required />
        </div>
        <div>
          <label>ZIP</label>
          <input type="text" id="intake-zip" required />
        </div>
      </div>

      <h2>Roof details</h2>
      <div class="grid-2">
        <div>
          <label>Roof type you want</label>
          <select id="intake-roof-type" required>
            <option value="">Select</option>
            <option value="architectural_shingle">Architectural shingle</option>
            <option value="metal">Metal</option>
            <option value="tile">Tile</option>
            <option value="flat">Flat / membrane</option>
          </select>
        </div>
        <div>
          <label>Is this through insurance?</label>
          <select id="intake-insurance" required>
            <option value="">Select</option>
            <option value="yes">Yes, insurance claim</option>
            <option value="no">No, paying out of pocket</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </div>
      </div>

      <button type="submit" class="btn-primary full-width">
        See my roof quotes
      </button>

      <p class="trust-text">
        Your information is securely encrypted · No impact to your credit score
      </p>
    </form>
  `;

  const form = document.getElementById('intake-form');
  form.addEventListener('submit', handleIntakeSubmit);
}

async function handleIntakeSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('intake-name').value.trim();
  const email = document.getElementById('intake-email').value.trim();
  const phone = document.getElementById('intake-phone').value.trim();
  const address = document.getElementById('intake-address').value.trim();
  const city = document.getElementById('intake-city').value.trim();
  const state = document.getElementById('intake-state').value.trim();
  const zip = document.getElementById('intake-zip').value.trim();
  const desiredRoofType = document.getElementById('intake-roof-type').value;
  const insurance = document.getElementById('intake-insurance').value;

  const user = await upsertHomeownerUser({ name, email, phone });

  const projectId = await createProject({
    homeownerId: user.id,
    address,
    city,
    state,
    zip,
    desiredRoofType,
    isInsuranceClaim: insurance === 'yes',
  });

  window.currentProjectId = projectId;

  // Fire-and-forget AI enrichment (Cloudflare function)
  fetch('/functions/roof-health-check', {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      address: `${address}, ${city}, ${state} ${zip}`,
    }),
  }).catch(() => {});

  navigate('/dashboard');
}

