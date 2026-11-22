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
  const get = (type) => parts.find((part) => part.type === type).value;

  return {
    weekday: get("weekday"),
    time: Number(get("hour")) + Number(get("minute")) / 60,
  };
}

export function getOpenStatus(date = new Date()) {
  const { weekday, time } = getBakeryNow(date);
  const hours = openingHours[weekday];

  if (hours && time >= hours.open && time < hours.close) {
    return `Open now · Closes ${formatHour(hours.close)}`;
  }

  if (hours && time < hours.open) {
    return `Closed · Opens today at ${formatHour(hours.open)}`;
  }

  const todayIndex = weekdays.indexOf(weekday);
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = weekdays[(todayIndex + offset) % 7];
    const nextHours = openingHours[nextDay];

    if (nextHours) {
      const when = offset === 1 ? "tomorrow" : nextDay;
      return `Closed · Opens ${when} at ${formatHour(nextHours.open)}`;
    }
  }

  return "Closed";
}

export function getAvailableToday() {
  const { weekday } = getBakeryNow();
  return bakeItems.filter((product) => product.days.includes(weekday));
}

export function canOrderForToday() {
  const { weekday, time } = getBakeryNow();
  const hours = openingHours[weekday];

  return Boolean(hours) && time < hours.close;
}

export function formatDayList(days) {
  if (days.length === 1) return days[0];
  return `${days.slice(0, -1).join(", ")} & ${days.at(-1)}`;
}

export function formatAvailability(days) {
  if (bakeDays.every((day) => days.includes(day))) {
    return "Monday to Saturday";
  }

  if (days.length === 1) {
    return `${days[0]} only`;
  }

  return formatDayList(days);
}

export function getDefaultDay() {
  const { weekday } = getBakeryNow();

  if (canOrderForToday()) {
    return { day: weekday, isToday: true };
  }

  const todayIndex = weekdays.indexOf(weekday);
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = weekdays[(todayIndex + offset) % 7];
    if (openingHours[nextDay]) {
      return { day: nextDay, isToday: false };
    }
  }

  return { day: bakeDays[0], isToday: false };
}

export function isMobile() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 48rem)").matches;
}


export function getOpenStatusSentence(date = new Date()) {
  const { weekday, time } = getBakeryNow(date);
  const hours = openingHours[weekday];

  if (hours && time >= hours.open && time < hours.close) {
    return `The bakery is open now and closes at ${formatHour(hours.close)}.`;
  }

  if (hours && time < hours.open) {
    return `The bakery is closed right now and opens today at ${formatHour(hours.open)}.`;
  }

  const todayIndex = weekdays.indexOf(weekday);
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = weekdays[(todayIndex + offset) % 7];
    const nextHours = openingHours[nextDay];

    if (nextHours) {
      const when = offset === 1 ? "tomorrow" : `on ${nextDay}`;
      return `The bakery is closed right now and opens ${when} at ${formatHour(nextHours.open)}.`;
    }
  }

  return "The bakery is closed.";
}