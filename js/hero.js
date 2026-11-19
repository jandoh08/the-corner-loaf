import { getOpenStatus } from "./helpers.js";

export function initHeroStatus() {
  const statusEls = document.querySelectorAll("[data-open-status]");
  if (!statusEls.length) return;

  const updateStatus = () => {
    const text = getOpenStatus();
    statusEls.forEach((el) => {
      el.textContent = text;
      el.dataset.open = text.startsWith("Open now");
    });
  };

  updateStatus();
  setInterval(updateStatus, 60 * 1000);
}
