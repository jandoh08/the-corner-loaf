import { getOpenStatus, isBakeryOpen } from './helpers.js';

const REFRESH_MS = 60 * 1000;

export function initHeroStatus() {
  const statusEls = document.querySelectorAll('[data-open-status]');
  if (!statusEls.length) return;

  const updateStatus = () => {
    const text = getOpenStatus();
    const isOpen = String(isBakeryOpen());
    statusEls.forEach((el) => {
      el.textContent = text;
      el.dataset.open = isOpen;
    });
  };

  let timerId = null;

  const start = () => {
    if (timerId !== null) return;
    updateStatus();
    timerId = setInterval(updateStatus, REFRESH_MS);
  };

  const stop = () => {
    if (timerId === null) return;
    clearInterval(timerId);
    timerId = null;
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', () => {
    stop();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (!document.hidden) start();
  });

  start();
}
