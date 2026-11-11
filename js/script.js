// The Corner Loaf — script.js

// === SECTION 1: Bake menu ===
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
    price: "GH₵ 35",
    days: ["Tuesday", "Friday"],
    image: "images/sample.jpg",
    imageAlt: "Fresh loaves baking in the oven",
  },
  {
    name: "Whole Wheat Loaf",
    description: "Dense, nutty whole wheat. Great for toast and sandwiches.",
    price: "GH₵ 28",
    days: ["Monday", "Wednesday", "Friday"],
    image: "images/sample.jpg",
    imageAlt: "Fresh loaves baking in the oven",
  },
  {
    name: "Chin Chin",
    description: "Crunchy, lightly sweetened. Comes in a bag of 200g.",
    price: "GH₵ 20",
    days: bakeDays,
    image: "images/sample2.jpg",
    imageAlt: "A selection of freshly baked treats",
  },
  {
    name: "Butter Croissants",
    description: "Buttery, flaky croissants. Baked fresh in the morning only.",
    price: "GH₵ 18",
    days: ["Saturday"],
    image: "images/sample2.jpg",
    imageAlt: "A selection of freshly baked treats",
  },
  {
    name: "Banana Bread",
    description:
      "Moist banana bread, not too sweet. Sold by the slice or full loaf.",
    price: "GH₵ 15 / slice",
    days: ["Thursday", "Saturday"],
    image: "images/sample2.jpg",
    imageAlt: "A selection of freshly baked treats",
  },
  {
    name: "Meat Pies",
    description:
      "Short-crust pastry filled with spiced minced meat and vegetables.",
    price: "GH₵ 12",
    days: ["Wednesday", "Friday"],
    image: "images/sample2.jpg",
    imageAlt: "A selection of freshly baked treats",
  },
];

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

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.imageAlt;
  image.loading = "lazy";

  const details = document.createElement("div");
  details.className = "product-details";

  const header = document.createElement("div");
  header.className = "product-header";

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = product.price;

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

const menuItems = document.getElementById("menu-items");
if (menuItems) {
  bakeItems.forEach((product, index) => {
    const row = document.createElement("tr");
    if (index % 2 === 1) {
      row.className = "alt-row";
    }

    [
      product.name,
      product.description,
      product.price,
      formatAvailability(product.days),
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    menuItems.appendChild(row);
  });
}

// === SECTION 2: Today's available bakes ===
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

const todayProducts = document.getElementById("today-products");
const heroStatus = document.getElementById("hero-status");
const weekday = getBakeryNow().weekday;

if (heroStatus) {
  const updateStatus = () => {
    heroStatus.textContent = getOpenStatus();
  };

  updateStatus();
  setInterval(updateStatus, 60 * 1000);
}

if (todayProducts) {
  const emptyMessage = document.createElement("p");
  emptyMessage.className = "today-empty";

  const availableToday = bakeItems.filter((product) =>
    product.days.includes(weekday),
  );

  if (availableToday.length === 0) {
    emptyMessage.textContent =
      weekday === "Sunday"
        ? "The bakery is closed today. Check back Monday for fresh bakes."
        : "No items are scheduled for today. Please check back soon.";
    todayProducts.appendChild(emptyMessage);
  } else {
    const productSelect = document.getElementById("order-item-select");

    availableToday.forEach((product) => {
      todayProducts.appendChild(createProductCard(product));

      if (productSelect) {
        const option = document.createElement("option");

        option.value = product.name;
        option.textContent = `${product.name} (${product.price})`;

        productSelect.appendChild(option);
      }
    });
  }
}

// === SECTION 3: Pre-order FAQ accordion ===
// Each .faq-trigger button expands and collapses its paired .faq-body when clicked.
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
    });

    if (!isOpen) {
      item.classList.add("active");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

// === SECTION 4: Pre-order tracker ===
// When the pre-order form is submitted, add the customer's name and order
// to the list below the form. Prevent the page from refreshing on submit.
const preorderForm = document.querySelector(".preorder-form");
const preorderList = document.getElementById("preorder-list");

if (preorderForm && preorderList) {
  const list = preorderList.querySelector("ul");

  preorderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = preorderForm.querySelectorAll(".form-field");
    const name = fields[0].value.trim();
    const order = fields[1].value.trim();

    if (!name || !order) {
      return;
    }

    const item = document.createElement("li");
    item.textContent = `${name}: ${order}`;

    list.appendChild(item);

    preorderForm.reset();
  });
}

// === SECTION 5: Contact form ===
// Validate the contact form before submission.
// Show a success message when all fields are correctly filled in.
// If a required field is missing, tell the user what needs to be fixed.
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = contactForm.querySelectorAll(".form-field");
    const [nameField, emailField, messageField] = fields;

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const missing = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!message) missing.push("message");

    if (missing.length > 0) {
      alert(`Please complete the following: ${missing.join(", ")}`);
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert("Thanks! Your message has been sent successfully.");
    contactForm.reset();
  });
}

// === SECTION 6: Order form ===
const orderForm = document.getElementById('order-form');
const orderList = document.getElementById('order-list');

if (orderForm && orderList) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('order-name').value;
    const contact = document.getElementById('order-contact').value;
    const product = document.getElementById('order-item-select').value;
    const quantity = document.getElementById('order-quantity').value;

    const item = document.createElement("li");

      item.textContent =
        `${name} | ${contact} | ${quantity} × ${product}`;

    orderList.appendChild(item);

    orderForm.reset();
  });
}