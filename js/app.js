import { initRouter, navigateTo } from "./router.js";
import { renderHomeView } from "./views/home.js";
import { setInitialState } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app-root");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  setInitialState();

  initRouter(root, {
    home: "home",
    intake: "intake",
    homeownerDashboard: "homeownerDashboard",
    rooferDashboard: "rooferDashboard",
  });

  // Top nav buttons
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.getAttribute("data-nav");
      if (route) navigateTo(route);
    });
  });

  // Initial view
  renderHomeView(root);
});
