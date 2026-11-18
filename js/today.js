import { formatPrice, getBakeryNow } from "./helpers.js";

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

export function renderTodayProducts(availableToday) {
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
