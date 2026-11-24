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

  infoBarObserver.observe(infoBar);

  window.addEventListener('pagehide', () => infoBarObserver.disconnect());
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) infoBarObserver.observe(infoBar);
  });
}
