import { getState, setProjects, setCurrentProject } from "../state.js";
import { navigateTo } from "../router.js";

export async function acceptQuoteById(quoteId) {
  const state = getState();
  const report = state.analysis;
  const quotes = state.quotes || [];
  const quote = quotes.find((q) => q.id === quoteId);

  const statusEl = document.getElementById("quote-status-global");
  if (!quote || !report) {
    if (statusEl) {
      statusEl.innerHTML = `<span class="status-dot"></span><span>Unable to accept quote.</span>`;
    }
    return;
  }

  if (statusEl) {
    statusEl.innerHTML = `<span class="status-dot"></span><span>Creating project…</span>`;
  }

  try {
    const response = await fetch("/acceptQuote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote, report })
    });

    if (!response.ok) throw new Error("Failed");

    const data = await response.json();
    const project = data.project;

    const updatedProjects = [...(state.projects || []), project];
    setProjects(updatedProjects);
    setCurrentProject(project);

    if (statusEl) {
      statusEl.innerHTML = `<span class="status-dot"></span><span>Project created!</span>`;
    }

    setTimeout(() => {
      navigateTo("projectDashboard");
    }, 700);
  } catch (err) {
    if (statusEl) {
      statusEl.innerHTML = `<span class="status-dot"></span><span>Error creating project.</span>`;
    }
  }
}
