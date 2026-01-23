import { renderHomeView } from "./views/home.js";
import { renderIntakeView } from "./views/intake.js";
import { renderHomeownerDashboardView } from "./views/homeownerDashboard.js";
import { renderRooferDashboardView } from "./views/rooferDashboard.js";

let appRoot = null;

const routes = {
  "/": "home",
  "/home": "home",
  "/intake": "intake",
  "/homeowner-dashboard": "homeownerDashboard",
  "/roofer-dashboard": "rooferDashboard",
};

export function initRouter(root) {
  appRoot = root;

  window.addEventListener("popstate", () => {
    handleRoute(location.pathname);
  });

  handleRoute(location.pathname);
}

export function navigateTo(routeKey) {
  let path = "/";
  switch (routeKey) {
    case "home":
      path = "/";
      break;
    case "intake":
      path = "/intake";
      break;
    case "homeownerDashboard":
      path = "/homeowner-dashboard";
      break;
    case "rooferDashboard":
      path = "/roofer-dashboard";
      break;
  }
  history.pushState({}, "", path);
  handleRoute(path);
}

function handleRoute(pathname) {
  if (!appRoot) return;

  const routeKey = routes[pathname] || "home";

  switch (routeKey) {
    case "home":
      renderHomeView(appRoot);
      break;
    case "intake":
      renderIntakeView(appRoot);
      break;
    case "homeownerDashboard":
      renderHomeownerDashboardView(appRoot);
      break;
    case "rooferDashboard":
      renderRooferDashboardView(appRoot);
      break;
    default:
      renderHomeView(appRoot);
  }
}
