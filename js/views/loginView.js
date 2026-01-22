// js/views/loginView.js

import { auth } from "../app.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { navigate } from "../app.js";

export function renderLoginView() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="dashboard-hero">
      <h1>Log in</h1>
      <p>Access your dashboard.</p>
    </section>

    <div class="card">
      <form id="login-form" class="intake-form">
        <h2>Sign in</h2>

        <label>Email</label>
        <input type="email" id="email" required />

        <label>Password</label>
        <input type="password" id="password" required />

        <button class="btn-primary full-width" type="submit">Log in</button>

        <p class="muted" style="margin-top:12px;">
          Don’t have an account?
          <button class="nav-link" data-route="/signup">Create one</button>
        </p>
      </form>
    </div>
  `;

  document.getElementById("login-form").addEventListener("submit", handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/dashboard");
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}
