/* ============================================================
   app.js — Fully Corrected SPA Router + Navigation
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { renderHomeView } from "./views/homeView.js";
import { renderHomeownerIntakeView } from "./views/homeownerIntakeView.js";
import { renderHomeownerDashboardView } from "./views/homeownerDashboardView.js";
import { renderRooferDashboardView } from "./views/rooferDashboardView.js";

/* ============================================================
   Firebase Init
   ============================================================ */

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

/* ============================================================
   ROUTER
   ============================================================ */

const routes = {
  "/": renderHomeView,
  "/intake": renderHomeownerIntakeView,
  "/dashboard": renderHomeownerDashboardView,
  "/roofer": renderRooferDashboardView
};

/**
 * Navigate to a route
 */
export function navigate(path) {
  window.history.pushState({}, "", path);
  renderRoute(path);
}

/**
 * Render a route
 */
function renderRoute(path) {
  const view = routes[path] || renderHomeView;
  view();
}

/**
 * Handle browser back/forward
 */
window.addEventListener("popstate", () => {
  renderRoute(window.location.pathname);
});

/* ============================================================
   ENABLE SPA NAVIGATION FOR ALL data-route BUTTONS
   ============================================================ */

document.addEventListener("click", (e) => {
  const route = e.target.getAttribute("data-route");
  if (route) {
    e.preventDefault();
    navigate(route);
  }
});

/* ============================================================
   AUTH STATE — NO REDIRECT BLOCKING
   ============================================================ */

onAuthStateChanged(auth, () => {
  // Always render the current route
  renderRoute(window.location.pathname || "/");
});

/* ============================================================
   LOGOUT
   ============================================================ */

export function logout() {
  signOut(auth);
  navigate("/");
}
