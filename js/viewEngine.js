// js/viewEngine.js
// Lazy view loader used by router

const root = document.getElementById('app');

// Map view names to dynamic imports
const viewLoaders = {
  landing: () => import('./views/landing.js'),
  intake: () => import('./views/intake.js'),
  intakeWizard: () => import('./views/intakeWizard.js'),
  homeownerDashboard: () => import('./views/homeownerDashboard.js'),
  rooferDashboard: () => import('./views/rooferDashboard.js'),
  notFound: () => import('./views/notFound.js')
};

// Helper: try common export names
function getRenderFn(module, viewName) {
  if (typeof module.renderView === 'function') return module.renderView;

  const specificName =
    'render' + viewName.charAt(0).toUpperCase() + viewName.slice(1) + 'View';

  if (typeof module[specificName] === 'function') return module[specificName];

  if (typeof module.default === 'function') return module.default;

  console.error(`No render function found for view "${viewName}"`);
  return null;
}

export async function renderView(viewName, params = {}) {
  const loader = viewLoaders[viewName];

  if (!loader) {
    root.innerHTML = `<p>View "${viewName}" not found.</p>`;
    return;
  }

  const module = await loader();
  const renderFn = getRenderFn(module, viewName);

  if (!renderFn) {
    root.innerHTML = `<p>View "${viewName}" has no render function.</p>`;
    return;
  }

  // All views render into the same root
  await renderFn({ root, params });
}
