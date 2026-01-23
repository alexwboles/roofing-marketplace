import { initRouter, navigateTo } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  const appRoot = document.getElementById("app");
  initRouter(appRoot);

  document.querySelectorAll(".top-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.getAttribute("data-nav") || "home";
      navigateTo(route);
    });
  });
});
