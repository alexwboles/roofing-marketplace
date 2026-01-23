// js/app.js
// Main SPA bootstrap — matches new router + viewEngine

import { navigate } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  // Router auto-initializes itself inside router.js

  // Top navigation buttons
  document.querySelectorAll(".top-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const route = btn.getAttribute("data-nav") || "/";
      navigate(route);
    });
  });
});
