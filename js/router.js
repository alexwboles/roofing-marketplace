import { renderHomeView } from "./views/home.js";
import { renderIntakeView } from "./views/intake.js";
import { renderHomeownerDashboardView } from "./views/homeownerDashboard.js";
import { renderRooferDashboardView } from "./views/rooferDashboard.js";

const routes = {
  home: renderHomeView,
  intake: renderIntakeView,
  homeownerDashboard: renderHomeownerDashboardView,
  rooferDashboard: renderRooferDashboardView
};

export function navigateTo(routeKey) {
  window.history.pushState({}, "", routeKey === "home" ? "/" : `/${routeKey}`);
  renderRoute(routeKey);
}

export function initRouter(root) {
  function handleRoute() {
    const path = window.location.pathname.replace("/", "") || "home";
    renderRoute(path);
  }

  window.addEventListener("popstate", handleRoute);
  handleRoute();
}

function renderRoute(routeKey) {
  const root = document.getElementById("app");
  const view = routes[routeKey];

  if (!view) {
    root.innerHTML = `<section><h2>404 – Page Not Found</h2></section>`;
    return;
  }

  view(root);
}
