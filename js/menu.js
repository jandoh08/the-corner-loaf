import { bakeItems } from "./data.js";
import { formatAvailability, formatPrice } from "./helpers.js";

export function renderMenuTable() {
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
