import { canOrderForToday, formatPrice } from "./helpers.js";
import { bakeItems } from "./data.js";

function populateProducts(select, products) {
  select.innerHTML = '<option value="">Select an item</option>';

  products.forEach((product) => {
    const option = document.createElement("option");

    option.value = product.name;
    option.textContent = `${product.name} (${formatPrice(product)})`;

    select.appendChild(option);
  });
}

export function initOrderForm(availableToday) {
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
