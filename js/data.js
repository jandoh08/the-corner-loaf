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
    image: "images/sourdough-loaf.jpg",
    imageAlt: "Sourdough loaf with a floured, scored crust",
  },
  {
    name: "Whole Wheat Loaf",
    description: "Dense, nutty whole wheat. Great for toast and sandwiches.",
    price: 28,
    days: ["Monday", "Wednesday", "Friday"],
    image: "images/whole-wheat-loaf.jpg",
    imageAlt: "Hearty whole wheat bread loaf with a textured crust",
  },
  {
    name: "Chin Chin",
    description: "Crunchy, lightly sweetened. Comes in a bag of 200g.",
    price: 20,
    days: bakeDays,
    image: "images/chin-chin.jpg",
    imageAlt: "Crunchy golden-brown chin chin snack pieces",
  },
  {
    name: "Butter Croissants",
    description: "Buttery, flaky croissants. Baked fresh in the morning only.",
    price: 18,
    days: ["Saturday"],
    image: "images/butter-croissants.jpg",
    imageAlt: "Flaky, golden-brown baked butter croissants",
  },
  {
    name: "Banana Bread",
    description:
      "Moist banana bread, not too sweet. Sold by the slice or full loaf.",
    price: 15,
    priceUnit: "slice",
    days: ["Thursday", "Saturday"],
    image: "images/banana-bread.jpg",
    imageAlt: "Banana bread loaf sliced to show its soft crumb",
  },
  {
    name: "Meat Pies",
    description:
      "Short-crust pastry filled with spiced minced meat and vegetables.",
    price: 12,
    days: ["Wednesday", "Friday"],
    image: "images/meat-pie.jpg",
    imageAlt: "Meat pie with crimped flaky pastry edges",
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
