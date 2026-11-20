import { initContactForm } from "./contact.js";
import { getAvailableToday } from "./helpers.js";
import { initHeroStatus } from "./hero.js";
import { renderMenuTable } from "./menu.js";
import { initOrderForm } from "./order.js";
import { renderTodayProducts } from "./today.js";

const availableToday = getAvailableToday();

renderMenuTable();
initHeroStatus();
renderTodayProducts(availableToday);
initContactForm();
initOrderForm(availableToday);
