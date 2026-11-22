import { initContactForm, renderOpeningHours } from "./contact.js";
import { getAvailableToday } from "./helpers.js";
import { initHeroStatus } from "./hero.js";
import { initOrderForm } from "./order.js";
import { initBakes } from "./today.js";

const availableToday = getAvailableToday();

initHeroStatus();
initBakes();
initContactForm();
initOrderForm(availableToday);
renderOpeningHours();