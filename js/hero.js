import { getOpenStatus } from "./helpers.js";

export function initHeroStatus() {
  const heroStatus = document.getElementById("hero-status");
  if (!heroStatus) return;

  const updateStatus = () => {
    heroStatus.textContent = getOpenStatus();
  };

  updateStatus();
  setInterval(updateStatus, 60 * 1000);
}
