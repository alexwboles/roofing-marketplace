// router.js — History API Router for Roofing Marketplace SPA
// -----------------------------------------------------------
// Clean, modular, Cloudflare‑compatible SPA router
// Supports role-based routing, protected routes, and lazy view loading

import { auth } from './auth.js';
import { renderView } from './viewEngine.js';

// ---------------------------------------------
// Route Table
// ---------------------------------------------
const routes = [
  { path: '/', view: 'landing' },
  { path: '/login', view: 'login' },
  { path: '/register', view: 'register' },

  // Intake
  { path: '/intake', view: 'intake' },
  { path: '/intakeWizard', view: 'intakeWizard' },

  // Homeowner Dashboard
  {
    path: '/homeownerDashboard',
    view: 'homeownerDashboard',
    protected: true,
    role: 'homeowner'
  },

  // Roofer Dashboard
  {
    path: '/rooferDashboard',
    view: 'rooferDashboard',
    protected: true,
    role: 'roofer'
  },

  // Project detail pages
  {
    path: '/project/:id',
    view: 'projectDetail',
    protected: true
  },

  // 404 fallback
  { path: '/404', view: '404' }
];

// ---------------------------------------------
// Utility: Match dynamic routes (/project/:id)
// ---------------------------------------------
function matchRoute(pathname) {
  for (const route of routes) {
    // Exact match
    if (!route.path.includes(':') && route.path === pathname) {
      return { route, params: {} };
    }

    // Dynamic match
    const routeParts = route.path.split('/');
    const pathParts = pathname.split('/');

    if (routeParts.length !== pathParts.length) continue;

    let params = {};
    let matched = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const key = routeParts[i].substring(1);
        params[key] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        matched = false;
        break;
      }
    }

    if (matched) return { route, params };
  }

  return null;
}

// ---------------------------------------------
// Navigation Handler
// ---------------------------------------------
async function navigate(pathname) {
  const match = matchRoute(pathname);

  if (!match) {
    history.pushState({}, '', '/404');
    return renderView('404');
  }

  const { route, params } = match;

  // Protected route check
  if (route.protected) {
    const user = auth.currentUser();

    if (!user) {
      history.pushState({}, '', '/login');
      return renderView('login');
    }

    if (route.role && user.role !== route.role) {
      history.pushState({}, '', '/404');
      return renderView('404');
    }
  }

  history.pushState({}, '', pathname);
  return renderView(route.view, params);
}

// ---------------------------------------------
// Intercept <a> clicks for SPA navigation
// ---------------------------------------------
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');

  if (!link) return;
  const url = new URL(link.href);

  // External links pass through
  if (url.origin !== window.location.origin) return;

  e.preventDefault();
  navigate(url.pathname);
});

// ---------------------------------------------
// Handle browser back/forward
// ---------------------------------------------
window.addEventListener('popstate', () => {
  navigate(window.location.pathname);
});

// ---------------------------------------------
// Initial load
// ---------------------------------------------
navigate(window.location.pathname);

// Expose navigate for programmatic routing
export { navigate };
