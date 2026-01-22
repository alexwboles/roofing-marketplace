// js/views/loginView.js

import { auth, signInWithEmailAndPassword } from '../firebase.js';
import { navigate } from '../app.js';

export function renderLoginView() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <section class="intake-hero">
      <h1>Welcome back</h1>
      <p>Log in to access your dashboard</p>
    </section>

    <div class="card" style="max-width:420px;margin:0 auto;">
      <form id="login-form">
        <label>Email</label>
        <input type="email" id="login-email" required />

        <label>Password</label>
        <input type="password" id="login-password" required />

        <button type="submit" class="btn-primary full-width" style="margin-top:14px;">
          Log in
        </button>

        <p id="login-error" class="muted" style="margin-top:10px;color:#dc2626;"></p>

        <p class="muted" style="margin-top:14px;text-align:center;">
          Don’t have an account?
          <span id="go-homeowner" style="color:#2563eb;cursor:pointer;">Request roof quotes</span>
        </p>
      </form>
    </div>
  `;

  document.getElementById('go-homeowner').onclick = () => navigate('/');

  const form = document.getElementById('login-form');
  form.addEventListener('submit', handleLoginSubmit);
}

async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorEl = document.getElementById('login-error');

  errorEl.textContent = '';

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Determine where to send the user
    if (email.includes('@roofer')) {
      navigate('/roofer');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Invalid email or password.';
  }
}

