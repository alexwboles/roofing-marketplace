/* ============================================================
   app.js — UPDATED ROUTER + SESSION PROJECT HANDLING
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { renderHomeView } from "./views/homeView.js";
import { renderHomeownerIntakeView } from "./views/homeownerIntakeView.js";
import { renderHomeownerDashboardView } from "./views/homeownerDashboardView.js";
import { renderRooferDashboardView } from "./views/rooferDashboardView.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "roofing-app-84ecc",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ------------------------------
// Router
// ------------------------------

const routes = {
  "/": renderHomeView,
  "/intake": renderHomeownerIntakeView,
  "/dashboard": renderHomeownerDashboardView,
  "/roofer": renderRooferDashboardView
};

export function navigate(path) {
  window.history.pushState({}, "", path);
  renderRoute(path);
}

function renderRoute(path) {
  const view = routes[path] || renderHomeView;
  view();
}

window.addEventListener("popstate", () => {
  renderRoute(window.location.pathname);
});

// ------------------------------
// REMOVE AUTH-GATE (IMPORTANT)
// ------------------------------

onAuthStateChanged(auth, () => {
  renderRoute(window.location.pathname || "/");
});

// ------------------------------
// Logout helper
// ------------------------------

export function logout() {
  signOut(auth);
  navigate("/");
}

