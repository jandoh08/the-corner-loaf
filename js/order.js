import { bakeItems, openingHours, weekdays } from "./data.js";
import { formatPrice, getBakeryNow } from "./helpers.js";

const WHATSAPP_NUMBER = "233551000000";
const PICKUP_ADDRESS = "17 Boundary Road, East Legon";
const SLOT_LENGTH = 0.5;

function populateSelect(select, placeholder, options) {
  select.replaceChildren(new Option(placeholder, ""));
  options.forEach(({ value, label }) => {
    select.append(new Option(label, value));
  });
}

const toOption = (product) => ({
  value: product.name,
  label: `${product.name} (${formatPrice(product)})`,
});

function formatTime(hours) {
  const hour = Math.floor(hours);
  const minutes = String(Math.round((hours - hour) * 60)).padStart(2, "0");

  return `${hour % 12 || 12}:${minutes}${hour < 12 ? "am" : "pm"}`;
}

function getTimeSlots(day, after = 0) {
  const hours = openingHours[day];
  if (!hours) return [];

  const slots = [];

  for (
    let time = hours.open;
    time <= hours.close - SLOT_LENGTH;
    time += SLOT_LENGTH
  ) {
    if (time > after) {
      slots.push({ value: formatTime(time), label: formatTime(time) });
    }
  }

  return slots;
}

function getUpcomingDays() {
  const todayIndex = weekdays.indexOf(getBakeryNow().weekday);
  const days = [];

  for (let offset = 1; offset <= 6; offset += 1) {
    const day = weekdays[(todayIndex + offset) % 7];

    if (openingHours[day]) {
      days.push({
        value: day,
        label: offset === 1 ? `Tomorrow (${day})` : day,
      });
    }
  }

  return days;
}

export function initOrderForm(availableToday) {
  const form = document.getElementById("order-form");
  if (!form) return;

  const itemSelect = document.getElementById("order-item-select");
  const daySelect = document.getElementById("order-day");
  const dayField = document.getElementById("order-day-field");
  const timeSelect = document.getElementById("order-time");
  const quantity = document.getElementById("order-quantity");
  const nameInput = document.getElementById("order-name");
  const help = document.getElementById("order-form-help");
  const status = document.getElementById("order-status");
  const todayRadio = form.querySelector('input[value="today-order"]');
  const preorderRadio = form.querySelector('input[value="pre-order"]');

  let todayAvailable = true;
  const isTodayOrder = () => todayRadio.checked;

  const refill = (select, placeholder, options) => {
    const previous = select.value;

    populateSelect(select, placeholder, options);
    select.disabled = options.length === 0;

    if (options.some((option) => option.value === previous)) {
      select.value = previous;
    }
  };

  const updateItems = () => {
    let products = [];
    let placeholder = "Select an item";

    if (isTodayOrder()) {
      products = availableToday;
    } else if (daySelect.value) {
      products = bakeItems.filter((product) =>
        product.days.includes(daySelect.value),
      );
    } else {
      placeholder = "Choose a collection day";
    }

    refill(itemSelect, placeholder, products.map(toOption));
  };

  const updateTimes = () => {
    let slots = [];
    let placeholder = "Select a time";

    if (isTodayOrder()) {
      const { weekday, time } = getBakeryNow();
      slots = getTimeSlots(weekday, time);
    } else if (daySelect.value) {
      slots = getTimeSlots(daySelect.value);
    } else {
      placeholder = "Choose a collection day";
    }

    refill(timeSelect, placeholder, slots);
  };

  const updateChoices = () => {
    updateItems();
    updateTimes();
  };

  const updateType = () => {
    const today = isTodayOrder();

    dayField.hidden = today;
    daySelect.required = !today;

    if (today) {
      help.textContent = "Today's order: showing only what is baked today.";
    } else {
      help.textContent = todayAvailable
        ? "Pre-order: pick the day you will collect, then choose from what is baked that day."
        : "Today's pick-up times are closed. Pick the day you will collect, then choose from what is baked that day.";
    }

    updateChoices();
  };

  const setDefaults = () => {
    const { weekday, time } = getBakeryNow();

    todayAvailable = getTimeSlots(weekday, time).length > 0;
    todayRadio.disabled = !todayAvailable;
    (todayAvailable ? todayRadio : preorderRadio).checked = true;
    populateSelect(daySelect, "Select a day", getUpcomingDays());
    updateType();
  };

  setDefaults();

  todayRadio.addEventListener("change", updateType);
  preorderRadio.addEventListener("change", updateType);
  daySelect.addEventListener("change", updateChoices);

  const min = Number(quantity.min) || 1;
  const max = Number(quantity.max) || Infinity;

  quantity.addEventListener("keydown", (event) => {
    if (["-", "+", ".", ",", "e", "E"].includes(event.key)) {
      event.preventDefault();
    }
  });

  form.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const next =
        (Number(quantity.value) || min) + Number(button.dataset.step);
      quantity.value = Math.min(max, Math.max(min, next));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const today = isTodayOrder();
    const message = [
      "Hello Marcus! I'd like to order from The Corner Loaf:",
      "",
      `• Type: ${today ? "Today's order" : "Pre-order"}`,
      `• Collection: ${today ? "Today" : daySelect.value} at ${timeSelect.value}`,
      `• Item: ${itemSelect.selectedOptions[0].textContent}`,
      `• Quantity: ${quantity.value}`,
      `• Name: ${nameInput.value.trim()}`,
      "",
      `Pick-up: ${PICKUP_ADDRESS}.`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener");

    const fallback = document.createElement("a");
    fallback.href = url;
    fallback.target = "_blank";
    fallback.rel = "noopener";
    fallback.textContent = "Open WhatsApp";

    status.classList.remove("is-error");
    status.replaceChildren(
      "Your order is ready in WhatsApp. Press send there to place it. Did WhatsApp not open? ",
      fallback,
    );
  });
}
