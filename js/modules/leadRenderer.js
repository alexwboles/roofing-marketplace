export async function renderLeads(containerId, leads) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!leads || leads.length === 0) {
    container.innerHTML = `<p>No active leads available.</p>`;
    return;
  }

  leads.forEach(lead => {
    const card = document.createElement("div");
    card.className = "lead-card";

    card.innerHTML = `
      <h3>${lead.name}</h3>
      <p><strong>Address:</strong> ${lead.address}</p>
      <p><strong>Roof Type:</strong> ${lead.roofType}</p>
      <p><strong>Age:</strong> ${lead.age} years</p>
      <button class="view-lead-btn" data-id="${lead.id}">View Details</button>
    `;

    container.appendChild(card);
  });
}
