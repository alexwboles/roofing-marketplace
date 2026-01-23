// js/viewEngine.js
// Lazy dynamic view loader for your SPA

const root = document.getElementById("app");

// Map view names → dynamic imports
const viewLoaders = {
  home: () => import("./views/home.js"),
  intake: () => import("./views/intake.js"),
  intakeWizard: () => import("./views/intakeWizard.js"),
  homeownerDashboard: () => import("./views/homeownerDashboard.js"),
  rooferDashboard: () => import("./views/rooferDashboard.js"),
  projectDashboard: () => import("./views/projectDashboard.js"),
  quoteComparison: () => import("./views/quoteComparison.js"),
  quoteSubmission: () => import("./views/quoteSubmission.js")
};

// Helper: find the correct render function
function getRenderFn(module, viewName) {
  if (typeof module.renderView === "function") return module.renderView;

  const specificName =
    "render" + viewName.charAt(0).toUpperCase() + viewName.slice(1) + "View";

  if (typeof module[specificName] === "function") return module[specificName];

  if (typeof module.default === "function") return module.default;

  console.error(`No render function found for view "${viewName}"`);
  return null;
}

// Main render function
export async function renderView(viewName, params = {}) {
  const loader = viewLoaders[viewName];

  if (!loader) {
    root.innerHTML = `<h1>View "${viewName}" not found.</h1>`;
    return;
  }

  const module = await loader();
  const renderFn = getRenderFn(module, viewName);

  if (!renderFn) {
    root.innerHTML = `<h1>View "${viewName}" has no render function.</h1>`;
    return;
  }

  await renderFn({ root, params });
}
