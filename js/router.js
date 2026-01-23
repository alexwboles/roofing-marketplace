// js/router.js
// SPA router

import { renderView } from "./viewEngine.js";

const routes = [
  { path: "/", view: "home" },
  { path: "/intake", view: "intake" },
  { path: "/intakeWizard", view: "intakeWizard" },
  { path: "/analysis", view: "analysis" },
  { path: "/quotes", view: "quoteComparison" },
  { path: "/homeownerDashboard", view: "homeownerDashboard" },
  { path: "/rooferDashboard", view: "rooferDashboard" },
  { path: "/projectDashboard", view: "projectDashboard" },
  { path: "/quoteSubmission", view: "quoteSubmission" },
  { path: "/404", view: "home" }
];

function matchRoute(pathname) {
  return routes.find((r) => r.path === pathname) || null;
}

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

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;

  e.preventDefault();
  navigate(url.pathname);
});

window.addEventListener("popstate", () => {
  navigate(window.location.pathname);
});

navigate(window.location.pathname);
