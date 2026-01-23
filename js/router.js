import { renderHomeView } from "./views/home.js";
import { renderIntakeView } from "./views/intake.js";
import { renderHomeownerDashboardView } from "./views/homeownerDashboard.js";
import { renderRooferDashboardView } from "./views/rooferDashboard.js";
import { renderQuoteSubmissionView } from "./views/quoteSubmission.js";
import { renderQuoteComparisonView } from "./views/quoteComparison.js";
import { renderProjectDashboardView } from "./views/projectDashboard.js";

const routes = {
  home: renderHomeView,
  intake: renderIntakeView,
  homeownerDashboard: renderHomeownerDashboardView,
  rooferDashboard: renderRooferDashboardView,
  quoteSubmission: renderQuoteSubmissionView,
  quoteComparison: renderQuoteComparisonView,
  projectDashboard: renderProjectDashboardView
};

function renderRoute(routeKey) {
  const root = document.getElementById("app");
  const view = routes[routeKey] || routes.home;
  view(root);
}

export function navigateTo(routeKey) {
  history.pushState(
    { routeKey },
    "",
    `/${routeKey === "home" ? "" : routeKey}`
  );
  renderRoute(routeKey);
}

export function initRouter() {
  window.addEventListener("popstate", (event) => {
    const routeKey = event.state?.routeKey || "home";
    renderRoute(routeKey);
  });

  const path = window.location.pathname.replace(/^\/+/, "") || "home";
  const routeKey = Object.keys(routes).includes(path) ? path : "home";
  renderRoute(routeKey);
}
