// js/router.js
// History API router with view engine + intake wizard support

import { renderView } from './viewEngine.js';

// ---------------------------------------------
// Route table
// ---------------------------------------------
const routes = [
  { path: '/', view: 'landing' },
  { path: '/intake', view: 'intake' },
  { path: '/intakeWizard', view: 'intakeWizard' },
  { path: '/homeownerDashboard', view: 'homeownerDashboard' },
  { path: '/rooferDashboard', view: 'rooferDashboard' },
  { path: '/404', view: 'notFound' }
];

// ---------------------------------------------
// Route matching (no params for now)
// ---------------------------------------------
function matchRoute(pathname) {
  const route = routes.find(r => r.path === pathname);
  if (!route) return null;
  return { route, params: {} };
}

// ---------------------------------------------
// Navigation
// ---------------------------------------------
export async function navigate(pathname) {
  const match = matchRoute(pathname);

  if (!match) {
    history.pushState({}, '', '/404');
    await renderView('notFound');
    return;
  }

  const { route, params } = match;

  history.pushState({}, '', pathname);
  await renderView(route.view, params);
}

// ---------------------------------------------
// Intercept internal <a> clicks
// ---------------------------------------------
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;

  const url = new URL(link.href);

  // external links: let browser handle
  if (url.origin !== window.location.origin) return;

  e.preventDefault();
  navigate(url.pathname);
});

// ---------------------------------------------
// Back/forward
// ---------------------------------------------
window.addEventListener('popstate', () => {
  navigate(window.location.pathname);
});

// ---------------------------------------------
// Initial load
// ---------------------------------------------
navigate(window.location.pathname);
