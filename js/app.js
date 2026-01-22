// js/app.js
import { auth, onAuthStateChanged } from './firebase.js';
import { renderHomeownerIntakeView } from './views/homeownerIntakeView.js';
import { renderHomeownerDashboardView } from './views/homeownerDashboardView.js';
import { renderRooferDashboardView } from './views/rooferDashboardView.js';
import { renderLoginView } from './views/loginView.js';

const routes = {
  '/': renderHomeownerIntakeView,
  '/dashboard': renderHomeownerDashboardView,
  '/roofer': renderRooferDashboardView,
  '/login': renderLoginView
};

export function navigate(path) {
  window.history.pushState({}, '', path);
  renderRoute(path);
}

function renderRoute(path) {
  const view = routes[path] || routes['/'];
  view();
}

window.addEventListener('popstate', () => {
  renderRoute(window.location.pathname);
});

document.addEventListener('click', (e) => {
  const route = e.target.getAttribute('data-route');
  if (route) {
    e.preventDefault();
    navigate(route);
  }
});

onAuthStateChanged(auth, (user) => {
  if (!user && window.location.pathname === '/dashboard') {
    navigate('/');
  } else {
    renderRoute(window.location.pathname || '/');
  }
});

// initial load
renderRoute(window.location.pathname || '/');
