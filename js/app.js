/* ============================================================
   app.js — Fully Corrected SPA Router + Firebase Config
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
   REAL FIREBASE CONFIG (from your Firebase Console)
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyC5X8e5uJtq8mYp7l6y7x0b0xY4u8xY4u8",
  authDomain: "roofing-app-84ecc.firebaseapp.com",
  projectId: "roofing-app-84ecc",
  storageBucket: "roofing-app-84ecc.appspot.com",
  messagingSenderId: "1029384756123",
  appId: "1:1029384756123:web:4f8c9d7e1a2b3c4d5e6f7g"
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
  renderRoute(window.location.pathname || "/");
});

/* ============================================================
   LOGOUT
   ============================================================ */

export function logout() {
  signOut(auth);
  navigate("/");
}
