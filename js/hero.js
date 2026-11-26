import { getOpenStatus } from './helpers.js';

const REFRESH_MS = 60 * 1000;

export function initHeroStatus() {
  const statusEls = document.querySelectorAll('[data-open-status]');
  if (!statusEls.length) return;

  const updateStatus = () => {
    const text = getOpenStatus();
    statusEls.forEach((el) => {
      el.textContent = text;
      el.dataset.open = String(text.startsWith('Open now'));
    });
  };

  let timerId = null;

  const start = () => {
    if (timerId !== null) return;
    updateStatus();
    timerId = setInterval(updateStatus, REFRESH_MS);
  };

  const stop = () => {
    clearInterval(timerId);
    timerId = null;
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  start();
}
