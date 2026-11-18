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

export function formatAvailability(days) {
  if (bakeDays.every((day) => days.includes(day))) {
    return "Every day";
  }

  if (days.length === 1) {
    return `${days[0]} only`;
  }

  const lastDay = days.at(-1);

  return `${days.slice(0, -1).join(", ")} & ${lastDay}`;
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
