// js/app.js

// ===== Views =====
import homeView from "./views/homeView.js";
import homeownerIntakeView from "./views/homeownerIntakeView.js";
import homeownerDashboardView from "./views/homeownerDashboardView.js";
import rooferDashboardView from "./views/rooferDashboardView.js";

// ===== Controllers =====
import { homeownerIntakeController } from "./controllers/homeownerIntakeController.js";
import { homeownerDashboardController } from "./controllers/homeownerDashboardController.js";
import { rooferDashboardController } from "./controllers/rooferDashboardController.js";

// ===== Simple render helper =====
function render(html) {
  const root = document.getElementById("app");
  if (!root) return;
  root.innerHTML = html;
}

// ===== Route table =====
const routes = {
  "/": () => {
    render(homeView());
  },
  "/intake": () => {
    render(homeownerIntakeView());
    homeownerIntakeController();
  },
  "/dashboard": () => {
    render(homeownerDashboardView());
    homeownerDashboardController();
  },
  "/roofer": () => {
    render(rooferDashboardView());
    rooferDashboardController();
  }
};

// ===== Router =====
function handleRoute(path) {
  const route = routes[path] || routes["/"];
  route();
}

function navigate(path) {
  if (window.location.pathname === path) {
    handleRoute(path);
    return;
  }
  history.pushState({}, "", path);
  handleRoute(path);
}

// ===== Link interception =====
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;

  if (href.startsWith("/")) {
    e.preventDefault();
    navigate(href);
  }
});

// ===== Back/forward =====
window.addEventListener("popstate", () => {
  handleRoute(window.location.pathname);
});

// ===== Initial load =====
document.addEventListener("DOMContentLoaded", () => {
  handleRoute(window.location.pathname);
});
