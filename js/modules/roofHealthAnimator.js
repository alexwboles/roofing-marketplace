export function animateRoofHealth(scoreElementId, score) {
  const el = document.getElementById(scoreElementId);
  if (!el) return;

  let current = 0;
  const target = Number(score);
  const duration = 1200;
  const step = Math.max(1, Math.floor(target / (duration / 16)));

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current;
  }, 16);
}
