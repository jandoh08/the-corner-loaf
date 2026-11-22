import {
  weekdays,
  bakeDays,
  bakeryTimeZone,
  openingHours,
  bakeItems,
} from "./data.js";

export function formatPrice(product) {
  const base = `GH₵ ${product.price}`;
  return product.priceUnit ? `${base} / ${product.priceUnit}` : base;
}

export const formatHour = (hour) =>
  `${hour % 12 || 12}${hour < 12 ? "am" : "pm"}`;

export function getBakeryNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
    timeZone: bakeryTimeZone,
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";

  return {
    weekday: get("weekday"),
    time: (Number(get("hour")) || 0) + (Number(get("minute")) || 0) / 60,
  };
}

function findNextOpenDay(weekday) {
  const todayIndex = weekdays.indexOf(weekday);

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = weekdays[(todayIndex + offset) % 7];
    const hours = openingHours[day];

    if (hours) return { day, offset, opens: hours.open };
  }

  return null;
}

function getOpenState(date = new Date()) {
  const { weekday, time } = getBakeryNow(date);
  const hours = openingHours[weekday];

  if (hours && time >= hours.open && time < hours.close) {
    return { kind: "open", closes: hours.close };
  }

  if (hours && time < hours.open) {
    return { kind: "opens-today", opens: hours.open };
  }
  const next = findNextOpenDay(weekday);
  return next ? { kind: "opens-later", ...next } : { kind: "closed" };
}

export function getOpenStatus(date = new Date()) {
  const state = getOpenState(date);

  switch (state.kind) {
    case "open":
      return `Open now · Closes ${formatHour(state.closes)}`;
    case "opens-today":
      return `Closed · Opens today at ${formatHour(state.opens)}`;
    case "opens-later": {
      const when = state.offset === 1 ? "tomorrow" : state.day;
      return `Closed · Opens ${when} at ${formatHour(state.opens)}`;
    }
    default:
      return "Closed";
  }
}

export function getOpenStatusSentence(date = new Date()) {
  const state = getOpenState(date);

  switch (state.kind) {
    case "open":
      return `The bakery is open now and closes at ${formatHour(state.closes)}.`;
    case "opens-today":
      return `The bakery is closed right now and opens today at ${formatHour(state.opens)}.`;
    case "opens-later": {
      const when = state.offset === 1 ? "tomorrow" : `on ${state.day}`;
      return `The bakery is closed right now and opens ${when} at ${formatHour(state.opens)}.`;
    }
    default:
      return "The bakery is closed.";
  }
}

export function getAvailableToday() {
  const { weekday } = getBakeryNow();
  return bakeItems.filter((product) => product.days.includes(weekday));
}

function canOrderForToday() {
  const { weekday, time } = getBakeryNow();
  const hours = openingHours[weekday];

  return Boolean(hours) && time < hours.close;
}

export function formatDayList(days) {
  if (days.length === 1) return days[0];
  return `${days.slice(0, -1).join(", ")} & ${days.at(-1)}`;
}

export function getDefaultDay() {
  const { weekday } = getBakeryNow();

  if (canOrderForToday()) {
    return { day: weekday, isToday: true };
  }

  const next = findNextOpenDay(weekday);
  return { day: next ? next.day : bakeDays[0], isToday: false };
}

export function getNextBakeDay(day) {
  const startIndex = bakeDays.indexOf(day);

  for (let offset = 1; offset <= bakeDays.length; offset += 1) {
    const candidate = bakeDays[(startIndex + offset) % bakeDays.length];

    if (bakeItems.some((product) => product.days.includes(candidate))) {
      return candidate;
    }
  }

  return null;
}