// js/views/homeownerIntakeView.js
import { navigate } from '../app.js';
import { createProject } from '../services/projects.js';

export function renderHomeownerIntakeView() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <section class="intake-hero">
      <h1>Get competing roof quotes</h1>
      <p>Enter your info once. Roofers compete for your business.</p>
    </section>

    <div class="hero-image">
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" alt="Modern home roof">
    </div>

    <div class="card">
      <form id="intake-form" class="intake-form">
        <h2>Basic info</h2>
        <div class="grid-2">
          <div>
            <label>Full name</label>
            <input type="text" id="name" required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" id="email" required />
          </div>
          <div>
            <label>Mobile phone</label>
            <input type="tel" id="phone" required />
          </div>
          <div>
            <label>Street address</label>
            <input type="text" id="address" required />
          </div>
        </div>

        <h2>Roof details</h2>
        <div class="grid-2">
          <div>
            <label>Roof type</label>
            <select id="roofType" required>
              <option value="shingle">Shingle</option>
              <option value="metal">Metal</option>
              <option value="tile">Tile</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <div>
            <label>Is this an insurance claim?</label>
            <select id="insurance" required>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not_sure">Not sure</option>
            </select>
          </div>
        </div>

        <h2>Optional: upload roof photos</h2>
        <input type="file" id="photos" accept="image/*" multiple />

        <button type="submit" class="btn-primary full-width">See available roof quotes</button>
        <p class="trust-text">Your information is securely stored. No impact to your credit score.</p>
      </form>
    </div>
  `;

  document.getElementById('intake-form').addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const roofType = document.getElementById('roofType').value;
  const insurance = document.getElementById('insurance').value;
  const photoFiles = document.getElementById('photos').files;

  const projectId = await createProject({
    name,
    email,
    phone,
    address,
    roofType,
    insurance
  });

  const base64Photos = [];
  for (const file of photoFiles) {
    const b64 = await fileToBase64(file);
    base64Photos.push(b64);
  }

  if (base64Photos.length > 0) {
    await fetch('/functions/analyze-roof-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, photos: base64Photos })
    });
  }

  await fetch('/functions/roof-health-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, address })
  });

  navigate('/dashboard');
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
