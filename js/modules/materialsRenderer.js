export function renderMaterialsList(containerId, materials) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!materials || materials.length === 0) {
    container.innerHTML = `<li>No materials found.</li>`;
    return;
  }

  materials.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} — ${item.quantity}`;
    container.appendChild(li);
  });
}
