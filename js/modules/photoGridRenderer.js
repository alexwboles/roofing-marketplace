export function renderPhotoGrid(containerId, photos) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!photos || photos.length === 0) {
    container.innerHTML = `<p>No photos uploaded yet.</p>`;
    return;
  }

  photos.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Roof photo";
    container.appendChild(img);
  });
}
