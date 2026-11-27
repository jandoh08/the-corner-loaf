import {
  bakeDays,
  openingHours,
  PHONE_DISPLAY,
  WHATSAPP_NUMBER,
} from './data.js';
import { formatHour } from './helpers.js';

function buildWhatsAppUrl(name, message) {
  const text = [`Hi, it's ${name}.`, '', message].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  const contactStatus = document.getElementById('contact-status');
  const nameEl = document.getElementById('contact-name');
  const messageEl = document.getElementById('contact-message');
  if (!contactForm || !contactStatus || !nameEl || !messageEl) return;

  const showStatus = (message, isError) => {
    contactStatus.textContent = message;
    contactStatus.classList.toggle('is-error', isError);
  };

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fail = (field, message) => {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', 'contact-status');
      showStatus(message, true);
      field.focus();
    };

    [nameEl, messageEl].forEach((field) => {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    });

    const name = nameEl.value.trim();
    const message = messageEl.value.trim();

    if (!name) {
      fail(nameEl, 'Please enter your name.');
      return;
    }

    if (!message) {
      fail(messageEl, 'Please enter a message.');
      return;
    }

    const url = buildWhatsAppUrl(name, message);
    window.open(url, '_blank', 'noopener,noreferrer');

    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = 'Open WhatsApp';

    contactStatus.classList.remove('is-error');
    contactStatus.replaceChildren(
      `WhatsApp should open with your message pre-filled. Press send there to reach us. If nothing opens, `,
      fallback,
      ` or call/message ${PHONE_DISPLAY}.`
    );
  });
}

// Monday to Saturday, then Sunday last, so days with identical hours sit
// next to each other and can be grouped into one row ("Monday to Friday").
const hoursDisplayOrder = [...bakeDays, 'Sunday'];

function describeHours(hours) {
  return hours
    ? `${formatHour(hours.open)} to ${formatHour(hours.close)}`
    : 'Closed';
}

function groupDays() {
  const groups = [];

  hoursDisplayOrder.forEach((day) => {
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
  const list = document.getElementById('contact-hours');
  if (!list) return;

  list.replaceChildren(
    ...groupDays().map(({ days, text }) => {
      const row = document.createElement('div');
      row.className = 'contact-hours-row';

      const term = document.createElement('dt');
      term.textContent = formatDayRange(days);

      const detail = document.createElement('dd');
      detail.textContent = text;

      row.append(term, detail);
      return row;
    })
  );
}
