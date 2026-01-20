export async function onRequestGet(context) {
  const data = {
    address: "123 Oak Street, St Augustine, FL",
    score: 72,
    material: "Asphalt Shingle",
    pitch: "6/12",
    roofAge: 12,
    roofArea: 2100,
    damage: "Granule loss, curling, missing shingles on north slope",
    recommendation: "Plan a full replacement within 12–18 months.",
    costRange: "$11,500 – $14,800",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Roof Health Report</title>
      <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 40px; color: #111827; }
        h1, h2, h3 { color: #111827; }
        .score-circle { width: 96px; height: 96px; border-radius: 50%; border: 6px solid #4f46e5; display:flex; align-items:center; justify-content:center; font-size: 2rem; font-weight:bold; }
        .section { margin-top: 24px; }
        .label { font-weight:bold; }
      </style>
    </head>
    <body>
      <h1>Roof Health Report</h1>
      <p>${data.address}</p>

      <div class="section" style="display:flex;align-items:center;gap:16px;">
        <div class="score-circle">${data.score}</div>
        <div>
          <h2>Overall Roof Health</h2>
          <p>${data.recommendation}</p>
        </div>
      </div>

      <div class="section">
        <h3>Key Details</h3>
        <p><span class="label">Material:</span> ${data.material}</p>
        <p><span class="label">Pitch:</span> ${data.pitch}</p>
        <p><span class="label">Estimated Age:</span> ${data.roofAge} years</p>
        <p><span class="label">Roof Area:</span> ${data.roofArea} sq ft</p>
      </div>

      <div class="section">
        <h3>Observed Damage</h3>
        <p>${data.damage}</p>
      </div>

      <div class="section">
        <h3>Estimated Cost Range</h3>
        <p>${data.costRange}</p>
      </div>

      <div class="section">
        <p style="font-size:0.8rem;color:#6b7280;">
          This report is an AI‑assisted estimate and does not replace an on‑site inspection by a licensed roofing contractor.
        </p>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
