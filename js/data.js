export const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const bakeDays = weekdays.slice(1);

export const bakeItems = [
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

export const bakeryTimeZone = "Africa/Accra";
export const openingHours = {
  Sunday: null,
  Monday: { open: 7, close: 17 },
  Tuesday: { open: 7, close: 17 },
  Wednesday: { open: 7, close: 17 },
  Thursday: { open: 7, close: 17 },
  Friday: { open: 7, close: 17 },
  Saturday: { open: 7, close: 14 },
};
