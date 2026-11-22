import { bakeDays, openingHours } from "./data.js";
import { formatHour } from "./helpers.js";

const WHATSAPP_NUMBER = "233551000000";

function buildWhatsAppUrl(name, message) {
  const text = [`Hi, it's ${name}.`, "", message].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function initContactForm() {
  const contactForm = document.querySelector(".contact-form");
  const contactStatus = document.getElementById("contact-status");
  if (!contactForm || !contactStatus) return;

  const showStatus = (message, isError) => {
    contactStatus.textContent = message;
    contactStatus.classList.toggle("is-error", isError);
  };

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameEl = document.getElementById("contact-name");
    const messageEl = document.getElementById("contact-message");

    const name = nameEl.value.trim();
    const message = messageEl.value.trim();

    if (!name) {
      showStatus("Please enter your name.", true);
      nameEl.focus();
      return;
    }

    if (!message) {
      showStatus("Please enter a message.", true);
      messageEl.focus();
      return;
    }

    const url = buildWhatsAppUrl(name, message);
    window.open(url, "_blank", "noopener,noreferrer");

    showStatus(
      "WhatsApp should open with your message pre-filled. Press send there to reach us. If nothing opens, call or message 0551 000 000.",
      false,
    );
  });
}

const weekOrder = [...bakeDays, "Sunday"];

function describeHours(hours) {
  return hours
    ? `${formatHour(hours.open)} to ${formatHour(hours.close)}`
    : "Closed";
}

function groupDays() {
  const groups = [];

  weekOrder.forEach((day) => {
    const text = describeHours(openingHours[day]);
    const last = groups.at(-1);

    if (last && last.text === text) {
      last.days.push(day);
    } else {
      groups.push({ days: [day], text });
    }
  });

  return groups;
}

function formatDayRange(days) {
  if (days.length === 1) return days[0];
  if (days.length === 2) return `${days[0]} and ${days[1]}`;
  return `${days[0]} to ${days.at(-1)}`;
}

export function renderOpeningHours() {
  const list = document.getElementById("contact-hours");
  if (!list) return;

  list.replaceChildren(
    ...groupDays().map(({ days, text }) => {
      const row = document.createElement("div");
      row.className = "contact-hours-row";

      const term = document.createElement("dt");
      term.textContent = formatDayRange(days);

      const detail = document.createElement("dd");
      detail.textContent = text;

      row.append(term, detail);
      return row;
    }),
  );
}