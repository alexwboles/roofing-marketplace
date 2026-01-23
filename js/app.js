import { navigate } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  // Router auto‑initializes itself, so no initRouter() needed

  document.querySelectorAll(".top-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.getAttribute("data-nav") || "/";
      navigate(route);
    });
  });
});
