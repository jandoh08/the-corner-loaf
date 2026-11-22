import { bakeDays, bakeItems } from "./data.js";
import {
  formatDayList,
  formatPrice,
  getBakeryNow,
  getDefaultDay,
  getOpenStatusSentence
} from "./helpers.js";

function createAccessiblePrice(product, className = "product-price") {
  const container = document.createElement("span");
  container.className = className;

  const visual = document.createElement("span");
  visual.setAttribute("aria-hidden", "true");
  visual.textContent = formatPrice(product);

  const sr = document.createElement("span");
  sr.className = "sr-only";
  const unitText = product.priceUnit ? ` per ${product.priceUnit}` : "";
  sr.textContent = `${product.price} Ghana cedis${unitText}`;

  container.append(visual, sr);
  return container;
}

function createProductCard(product, day) {
  const item = document.createElement("li");
  item.className = "product-item";

  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.imageAlt;
  image.width = 300;
  image.height = 402;

  const details = document.createElement("div");
  details.className = "product-details";

  const header = document.createElement("div");
  header.className = "product-header";

  const name = document.createElement("h4");
  name.className = "product-name";
  name.textContent = product.name;

  const price = createAccessiblePrice(product, "product-price");

  header.append(name, price);

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const tag = document.createElement("span");
  tag.className = "product-tag";
  if (product.days.length === bakeDays.length) {
    tag.textContent = "Baked every day (Mon–Sat)";
  } else if (product.days.length === 1) {
    tag.textContent = `${product.days[0]}s only`;
  } else if (day === "All Bakes") {
    tag.textContent = `Baked: ${formatDayList(product.days)}`;
  } else {
    const otherDays = product.days.filter((d) => d !== day);
    tag.textContent = `Also baked: ${formatDayList(otherDays)}`;
  }

  details.append(header, description, tag);
  card.append(image, details);
  item.appendChild(card);
  return item;
}

function createDayPill(day, { isToday, isSelected }) {
  const label = document.createElement("label");
  label.className = "day-pill";

  const input = document.createElement("input");
  input.type = "radio";
  input.name = "bake-day";
  input.value = day;
  input.checked = isSelected;
  input.className = "sr-only day-pill-input";

  const text = document.createElement("span");
  text.className = "day-pill-text";

  const short = document.createElement("span");
  short.className = "day-pill-label";
  short.setAttribute("aria-hidden", "true");
  short.textContent = day === "All Bakes" ? "All" : day.slice(0, 3);

  const full = document.createElement("span");
  full.className = "sr-only";
  full.textContent =
    day === "All Bakes"
      ? "All bakes for the week"
      : isToday
        ? `${day} (today)`
        : day;

  text.append(short, full);

  if (isToday) {
    const marker = document.createElement("span");
    marker.className = "day-pill-today";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "Today";

    if (isSelected) {
      marker.hidden = true;
    }
    text.append(marker);
  }

  label.append(input, text);
  return label;
}

function renderDay(day, today, elements) {
  const isAll = day === "All Bakes";
  const items = isAll
    ? bakeItems
    : bakeItems.filter((product) => product.days.includes(day));
  const isSelectedToday = day === today;
  const countStr = `${items.length} ${items.length === 1 ? "bake" : "bakes"}`;

  if (elements.label) {
    elements.label.replaceChildren();

    const titleGroup = document.createElement("span");
    titleGroup.className = "day-label-heading";

    const name = document.createElement("span");
    name.className = "day-label-name";
    name.textContent = isAll ? "All Bakes This Week" : day;
    titleGroup.appendChild(name);

    if (isSelectedToday) {
      const todayBadge = document.createElement("span");
      todayBadge.className = "day-label-today-badge";
      todayBadge.setAttribute("aria-hidden", "true");
      todayBadge.textContent = "Today";
      titleGroup.appendChild(todayBadge);
    }

    elements.label.appendChild(titleGroup);
  }

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "today-empty";
    empty.textContent = `Nothing is scheduled for ${day}. Check back soon.`;
    elements.products.replaceChildren(empty);
    return `${day}: nothing scheduled`;
  }

  elements.products.replaceChildren(
    ...items.map((product) => createProductCard(product, day)),
  );
  return `${isAll ? "All bakes" : day}${isSelectedToday ? " (today)" : ""}: ${countStr}`;
}

export function initBakes() {
  const elements = {
    pills: document.getElementById("day-pills"),
    products: document.getElementById("today-products"),
    label: document.getElementById("day-label"),
    status: document.getElementById("day-status"),
    note: document.getElementById("bakes-note"),
    noteMessage: document.getElementById("bakes-note-message"),
    statusSpoken: document.getElementById("bakes-note-spoken"),
  };
  if (!elements.pills || !elements.products) return;

  document.getElementById("today-loading")?.remove();

  const { weekday: today } = getBakeryNow();
  const { day: startDay, isToday } = getDefaultDay();

  if (!isToday && elements.noteMessage) {
    elements.noteMessage.textContent = `Showing ${startDay}'s bakes`;
  }

  if (elements.statusSpoken) {
    const spoken = [getOpenStatusSentence()];
    if (!isToday) spoken.push(`Showing ${startDay}'s bakes.`);
    elements.statusSpoken.textContent = spoken.join(" ");
  }

  const selectableDays = [...bakeDays, "All Bakes"];

  elements.pills.replaceChildren(
    ...selectableDays.map((day) =>
      createDayPill(day, {
        isToday: day === today,
        isSelected: day === startDay,
      }),
    ),
  );

  renderDay(startDay, today, elements);

  elements.pills.addEventListener("change", (event) => {
    const selectedDay = event.target.value;
    const message = renderDay(selectedDay, today, elements);
    elements.status.textContent = message;

    const todayMarker = elements.pills.querySelector(".day-pill-today");
    if (todayMarker) {
      todayMarker.hidden = selectedDay === today;
    }

    if (elements.noteMessage) {
      elements.noteMessage.textContent = "";
    }

    if (elements.statusSpoken) {
      elements.statusSpoken.textContent = getOpenStatusSentence();
    }
  });
}
