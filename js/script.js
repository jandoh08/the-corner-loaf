import { initContactForm, renderOpeningHours } from './contact.js';
import { getAvailableToday } from './helpers.js';
import { initHeroStatus } from './hero.js';
import { initOrderForm } from './order.js';
import { initBakes } from './today.js';

const availableToday = getAvailableToday();

initHeroStatus();
initBakes();
initContactForm();
initOrderForm(availableToday);
renderOpeningHours();

const header = document.querySelector('header');
const infoBar = document.querySelector('.info-bar');

if (header && infoBar && 'ResizeObserver' in window) {
  const infoBarObserver = new ResizeObserver(() => {
    header.style.setProperty('--info-bar-height', `${infoBar.offsetHeight}px`);
  });

  let isObserving = false;

  const observeInfoBar = () => {
    if (isObserving) return;
    infoBarObserver.observe(infoBar);
    isObserving = true;
  };

  const disconnectInfoBar = () => {
    if (!isObserving) return;
    infoBarObserver.disconnect();
    isObserving = false;
  };

  observeInfoBar();

  window.addEventListener('pagehide', disconnectInfoBar);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) observeInfoBar();
  });
}
