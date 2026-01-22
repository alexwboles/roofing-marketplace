// js/views/loginView.js

import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setDoc,
  doc,
  db
} from '../firebase.js';

import { navigate } from '../app.js';

export function renderLoginView() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="auth-split">
      
      <!-- LEFT SIDE: Marketing -->
      <div class="auth-left">
        <div class="auth-left-inner">
          <h1>Roofing made simple</h1>
          <p class="auth-subtitle">
            Compare quotes, upload photos, and check roof health — all in one place.
          </p>

          <ul class="auth-benefits">
            <li>✓ Get competing roof quotes instantly</li>
            <li>✓ AI photo analysis for materials & square footage</li>
            <li>✓ Insurance eligibility & hail‑damage detection</li>
            <li>✓ Trusted roofers compete for your business</li>
          </ul>
        </div>
      </div>

      <!-- RIGHT SIDE: Login/Register -->
      <div class="auth-right">
        <div class="auth-card">

          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">Log In</button>
            <button class="auth-tab" data-tab="register">Create Account</button>
          </div>

          <!-- LOGIN FORM -->
          <form id="login-form" class="auth-form active">
            <label>Email</label>
            <input type="email" id="login-email" required />

            <label>Password</label>
            <input type="password" id="login-password" required />

            <button type="submit" class="btn-primary full-width" style="margin-top:14px;">
              Log In
            </button>

            <p id="login-error" class="muted" style="margin-top:10px;color:#dc2626;"></p>
          </form>

          <!-- REGISTER FORM -->
          <form id="register-form" class="auth-form">
            <label>Full name</label>
            <input type="text" id="reg-name" required />

            <label>Email</label>
            <input type="email" id="reg-email" required />

            <label>Password</label>
            <input type="password" id="reg-password" required />

            <label>Account type</label>
            <select id="reg-role" required>
              <option value="homeowner">Homeowner</option>
              <option value="roofer">Roofer</option>
            </select>

            <button type="submit" class="btn-primary full-width" style="margin-top:14px;">
              Create Account
            </button>

            <p id="register-error" class="muted" style="margin-top:10px;color:#dc2626;"></p>
          </form>

        </div>
      </div>

    </div>
  `;

  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`${btn.dataset.tab}-form`).classList.add('active');
    });
  });

  // Login handler
  document.getElementById('login-form').addEventListener('submit', handleLogin);

  // Register handler
  document.getElementById('register-form').addEventListener('submit', handleRegister);
}

// -------------------- LOGIN --------------------
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorEl = document.getElementById('login-error');

  errorEl.textContent = '';

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Route based on role
    if (email.includes('@roofer')) {
      navigate('/roofer');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    errorEl.textContent = 'Invalid email or password.';
  }
}

// -------------------- REGISTER --------------------
async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const role = document.getElementById('reg-role').value;
  const errorEl = document.getElementById('register-error');

  errorEl.textContent = '';

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // Save user profile
    await setDoc(doc(db, 'users', email), {
      name,
      email,
      role,
      createdAt: Date.now()
    });

    // Route based on role
    if (role === 'roofer') {
      navigate('/roofer');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    errorEl.textContent = 'Unable to create account.';
  }
}
