// js/router.js
// Clean, production-ready SPA router using History API

import { renderView } from "./viewEngine.js";

// ---------------------------------------------
// Route table (matches your actual /js/views folder)
// ---------------------------------------------
const routes = [
  { path: "/", view: "home" },
  { path: "/intake", view: "intake" },
  { path: "/intakeWizard", view: "intakeWizard" },
  { path: "/homeownerDashboard", view: "homeownerDashboard" },
  { path: "/rooferDashboard", view: "rooferDashboard" },
  { path: "/projectDashboard", view: "projectDashboard" },
  { path: "/quoteComparison", view: "quoteComparison" },
  { path: "/quoteSubmission", view: "quoteSubmission" },

  // fallback
  { path: "/404", view: "home" }
];

// ---------------------------------------------
// Route matching
// ---------------------------------------------
function matchRoute(pathname) {
  return routes.find(r => r.path === pathname) || null;
}

// ---------------------------------------------
// Navigation
// ---------------------------------------------
export async function navigate(pathname) {
  const match = matchRoute(pathname);

  if (!match) {
    history.pushState({}, "", "/404");
    await renderView("home");
    return;
  }

  history.pushState({}, "", pathname);
  await renderView(match.view);
}

// ---------------------------------------------
// Intercept internal <a> clicks
// ---------------------------------------------
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const url = new URL(link.href);

  // external links → allow default
  if (url.origin !== window.location.origin) return;

  e.preventDefault();
  navigate(url.pathname);
});

// ---------------------------------------------
// Back/forward buttons
// ---------------------------------------------
window.addEventListener("popstate", () => {
  navigate(window.location.pathname);
});

// ---------------------------------------------
// Initial load
// ---------------------------------------------
navigate(window.location.pathname);
