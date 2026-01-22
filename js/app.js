// js/app.js
import { auth, onAuthStateChanged } from './firebase.js';
import { renderHomeownerIntakeView } from './views/homeownerIntakeView.js';
import { renderHomeownerDashboardView } from './views/homeownerDashboardView.js';
import { renderRooferDashboardView } from './views/rooferDashboardView.js';
import { renderLoginView } from './views/loginView.js';

export let currentUser = null;
export let currentProjectId = null;

const routes = {
  '/': renderHomeownerIntakeView,
  '/dashboard': renderHomeownerDashboardView,
  '/roofer': renderRooferDashboardView,
  '/login': renderLoginView,
};

export function navigate(path) {
  window.history.pushState({}, '', path);
  router();
}

function router() {
  const path = window.location.pathname || '/';
  const view = routes[path] || renderHomeownerIntakeView;
  view();
}

window.onpopstate = router;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (!user && window.location.pathname !== '/') {
    navigate('/login');
    return;
  }
  router();
});

document.addEventListener('DOMContentLoaded', () => {
  const navHomeowner = document.getElementById('nav-homeowner');
  const navRoofer = document.getElementById('nav-roofer');
  const navLogin = document.getElementById('nav-login');

  if (navHomeowner) navHomeowner.onclick = () => navigate('/');
  if (navRoofer) navRoofer.onclick = () => navigate('/roofer');
  if (navLogin) navLogin.onclick = () => navigate('/login');

  router();
});
