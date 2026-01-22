const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");

if (photoInput && preview) {
  photoInput.addEventListener("change", () => {
    preview.innerHTML = "";
    [...photoInput.files].slice(0, 5).forEach(file => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      preview.appendChild(img);
    });
  });
}

// keep your existing submitIntake handler here
// document.getElementById("submitIntake").addEventListener("click", ...);
