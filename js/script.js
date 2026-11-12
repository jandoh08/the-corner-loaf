// The Corner Loaf — script.js

// === Data ===
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const bakeDays = weekdays.slice(1);

const bakeItems = [
  {
    name: "Sourdough Loaf",
    description:
      "Classic long-ferment sourdough, crusty outside and chewy inside.",
    price: 35,
    days: ["Tuesday", "Friday"],
    image: "images/bread-in-oven.jpg",
    imageAlt: "Fresh loaves baking in the oven",
  },
  {
    name: "Whole Wheat Loaf",
    description: "Dense, nutty whole wheat. Great for toast and sandwiches.",
    price: 28,
    days: ["Monday", "Wednesday", "Friday"],
    image: "images/bread-in-oven.jpg",
    imageAlt: "Fresh loaves baking in the oven",
  },
  {
    name: "Chin Chin",
    description: "Crunchy, lightly sweetened. Comes in a bag of 200g.",
    price: 20,
    days: bakeDays,
    image: "images/bofrot.jpg",
    imageAlt: "A selection of freshly baked treats",
  },
  {
    name: "Butter Croissants",
    description: "Buttery, flaky croissants. Baked fresh in the morning only.",
    price: 18,
    days: ["Saturday"],
    image: "images/bofrot.jpg",
    imageAlt: "A selection of freshly baked treats",
  },
  {
    name: "Banana Bread",
    description:
      "Moist banana bread, not too sweet. Sold by the slice or full loaf.",
    price: 15,
    priceUnit: "slice",
    days: ["Thursday", "Saturday"],
    image: "images/bofrot.jpg",
    imageAlt: "A selection of freshly baked treats",
  },
  {
    name: "Meat Pies",
    description:
      "Short-crust pastry filled with spiced minced meat and vegetables.",
    price: 12,
    days: ["Wednesday", "Friday"],
    image: "images/bofrot.jpg",
    imageAlt: "A selection of freshly baked treats",
  },
];

const bakeryTimeZone = "Africa/Accra";
const openingHours = {
  Sunday: null,
  Monday: { open: 7, close: 17 },
  Tuesday: { open: 7, close: 17 },
  Wednesday: { open: 7, close: 17 },
  Thursday: { open: 7, close: 17 },
  Friday: { open: 7, close: 17 },
  Saturday: { open: 7, close: 14 },
};

// === Helpers ===
function formatPrice(product) {
  const base = `GH₵ ${product.price}`;
  return product.priceUnit ? `${base} / ${product.priceUnit}` : base;
}

function formatAvailability(days) {
  if (bakeDays.every((day) => days.includes(day))) {
    return "Every day";
  }

  if (days.length === 1) {
    return `${days[0]} only`;
  }

  const lastDay = days.at(-1);

  return `${days.slice(0, -1).join(", ")} & ${lastDay}`;
}

const formatHour = (hour) => `${hour % 12 || 12}${hour < 12 ? "am" : "pm"}`;

function getBakeryNow(date = new Date()) {
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

function getOpenStatus(date = new Date()) {
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

function getAvailableToday() {
  const { weekday } = getBakeryNow();
  return bakeItems.filter((product) => product.days.includes(weekday));
}

function canOrderForToday() {
  const { weekday, time } = getBakeryNow();
  const hours = openingHours[weekday];

  return Boolean(hours) && time < hours.close;
}

// === Menu table ===
function renderMenuTable() {
  const menuItems = document.getElementById("menu-items");
  if (!menuItems) return;

  bakeItems.forEach((product, index) => {
    const row = document.createElement("tr");
    if (index % 2 === 1) {
      row.className = "alt-row";
    }

    [
      product.name,
      product.description,
      formatPrice(product),
      formatAvailability(product.days),
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    menuItems.appendChild(row);
  });
}

// === Hero status ===
function initHeroStatus() {
  const heroStatus = document.getElementById("hero-status");
  if (!heroStatus) return;

  const updateStatus = () => {
    heroStatus.textContent = getOpenStatus();
  };

  updateStatus();
  setInterval(updateStatus, 60 * 1000);
}

// === Today's cards ===
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.imageAlt;

  const details = document.createElement("div");
  details.className = "product-details";

  const header = document.createElement("div");
  header.className = "product-header";

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatPrice(product);

  header.append(name, price);

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  details.append(header, description);

  if (product.days.length === 1) {
    const tag = document.createElement("p");
    tag.className = "product-tag";
    tag.textContent = "Today only";
    details.append(tag);
  }

  card.append(image, details);
  return card;
}

function renderTodayProducts(availableToday) {
  const todayProducts = document.getElementById("today-products");
  const todayLoading = document.getElementById("today-loading");
  if (!todayProducts) return;

  todayLoading?.remove();

  if (availableToday.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "today-empty";
    emptyMessage.textContent =
      getBakeryNow().weekday === "Sunday"
        ? "The bakery is closed today. Check back Monday for fresh bakes."
        : "No items are scheduled for today. Please check back soon.";
    todayProducts.appendChild(emptyMessage);
    return;
  }

  availableToday.forEach((product) => {
    todayProducts.appendChild(createProductCard(product));
  });
}

// === FAQ accordion ===
// Each .faq-trigger button expands and collapses its paired .faq-body when clicked.
function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
        faqItem
          .querySelector(".faq-trigger")
          .setAttribute("aria-expanded", "false");
        faqItem.querySelector(".faq-body").hidden = true;
      });

      if (!isOpen) {
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
        item.querySelector(".faq-body").hidden = false;
      }
    });
  });
}

// === Contact form ===
// The browser's built-in validation already blocks empty fields, so the only
// check left for JS is an address like "kofi@mail" that the browser accepts.
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");
  const contactStatus = document.getElementById("contact-status");
  if (!contactForm || !contactStatus) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showStatus = (message, isError) => {
    contactStatus.textContent = message;
    contactStatus.classList.toggle("is-error", isError);
  };

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("contact-email").value.trim();

    if (!emailPattern.test(email)) {
      showStatus("Please enter a valid email address.", true);
      return;
    }

    showStatus("Thanks! Your message has been sent successfully.", false);
    contactForm.reset();
  });
}

// === Order form ===
function populateProducts(select, products) {
  select.innerHTML = '<option value="">Select an item</option>';

  products.forEach((product) => {
    const option = document.createElement("option");

    option.value = product.name;
    option.textContent = `${product.name} (${formatPrice(product)})`;

    select.appendChild(option);
  });
}

function initOrderForm(availableToday) {
  const orderForm = document.getElementById("order-form");
  const orderList = document.getElementById("order-list");
  const productSelect = document.getElementById("order-item-select");
  const orderTypeSelect = document.getElementById("order-type");
  const orderFormHelp = document.getElementById("order-form-help");

  if (!orderForm || !orderList || !productSelect || !orderTypeSelect) return;

  const orderItems = orderList.querySelector("ul");

  const updateOrderOptions = () => {
    if (orderTypeSelect.value === "today-order") {
      populateProducts(productSelect, availableToday);
      orderFormHelp.textContent =
        "Today's Order: showing only today's available bakes.";
    } else {
      populateProducts(productSelect, bakeItems);
      orderFormHelp.textContent = canOrderForToday()
        ? "Pre-Order: showing all available items."
        : "Pre-Order: showing all available items. Orders for today are closed.";
    }
  };

  const setOrderDefaults = () => {
    const todayOption = orderTypeSelect.querySelector(
      'option[value="today-order"]',
    );
    const canOrderToday = canOrderForToday();

    todayOption.disabled = !canOrderToday;
    orderTypeSelect.value = canOrderToday ? "today-order" : "pre-order";
    updateOrderOptions();
  };

  setOrderDefaults();
  orderTypeSelect.addEventListener("change", updateOrderOptions);

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("order-name").value;
    const contact = document.getElementById("order-contact").value;
    const product = productSelect.value;
    const quantity = document.getElementById("order-quantity").value;
    const type = orderTypeSelect.selectedOptions[0].textContent;

    const item = document.createElement("li");
    item.textContent = `${name} | ${contact} | ${quantity} × ${product} | ${type}`;
    orderItems.appendChild(item);

    orderForm.reset();
    setOrderDefaults();
  });
}

function init() {
  const availableToday = getAvailableToday();

  renderMenuTable();
  initHeroStatus();
  renderTodayProducts(availableToday);
  initFaq();
  initContactForm();
  initOrderForm(availableToday);
}

init();
