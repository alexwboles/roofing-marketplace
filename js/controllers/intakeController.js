import { getState, setAnalysis } from "../state.js";
import { navigateTo } from "../router.js";

export async function handleIntakeSubmit(files) {
  const state = getState();
  const statusEl = document.getElementById("intake-status");

  // Basic validation
  if (!state.intake.address) {
    statusEl.innerHTML = `<span class="status-dot"></span><span>Please enter an address.</span>`;
    return;
  }

  statusEl.innerHTML = `<span class="status-dot"></span><span>Uploading photos and analyzing roof…</span>`;

  // -----------------------------
  // Build FormData for the API
  // -----------------------------
  const formData = new FormData();

  // Add address
  formData.append("address", state.intake.address);

  // Add metadata as JSON
  formData.append(
    "metadata",
    JSON.stringify({
      roofAge: state.intake.roofAge,
      squareFootage: state.intake.squareFootage,
      pitch: state.intake.pitch,
      valleys: state.intake.valleys,
      layers: state.intake.layers,
      material: state.intake.material,
      notes: state.intake.notes
    })
  );

  // Add photos (FileList)
  if (files && files.length > 0) {
    Array.from(files).forEach((file) => {
      formData.append("photos[]", file);
    });
  }

  // -----------------------------
  // Call the AI analysis endpoint
  // -----------------------------
  let report;
  try {
    const response = await fetch("/analyzeRoof", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Analysis failed");
    }

    report = await response.json();
  } catch (err) {
    console.error(err);
    statusEl.innerHTML = `<span class="status-dot"></span><span>Analysis failed. Please try again.</span>`;
    return;
  }

  // -----------------------------
  // Save the AI report to state
  // -----------------------------
  setAnalysis(report);

  statusEl.innerHTML = `<span class="status-dot"></span><span>Report ready! Redirecting…</span>`;

  // -----------------------------
  // Redirect based on role
  // -----------------------------
  setTimeout(() => {
    navigateTo(
      state.role === "roofer"
        ? "rooferDashboard"
        : "homeownerDashboard"
    );
  }, 700);
}
