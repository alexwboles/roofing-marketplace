import { renderPhotoGrid } from "../modules/photoGridRenderer.js";
import { renderMaterialsList } from "../modules/materialsRenderer.js";
import { animateRoofHealth } from "../modules/roofHealthAnimator.js";

export async function homeownerDashboardController() {
  try {
    const res = await fetch("/api/homeowner-dashboard");
    const data = await res.json();

    // Roof health
    animateRoofHealth("roofScore", data.healthScore);
    document.getElementById("roofCondition").textContent = data.condition;
    document.getElementById("roofAge").textContent = `${data.age} yrs`;
    document.getElementById("roofMaterial").textContent = data.material;
    document.getElementById("roofSqft").textContent = `${data.sqft} sq ft`;

    // Photos
    renderPhotoGrid("homeownerPhotoGrid", data.photos);

    // Quotes
    const quotesList = document.getElementById("quotesList");
    quotesList.innerHTML = "";

    data.quotes.forEach(q => {
      const div = document.createElement("div");
      div.className = "quote-card";
      div.innerHTML = `
        <p><strong>Contractor:</strong> ${q.contractor}</p>
        <p><strong>Price:</strong> $${q.price}</p>
        <p>${q.notes}</p>
      `;
      quotesList.appendChild(div);
    });

  } catch (err) {
    console.error("Dashboard load error:", err);
  }
}
