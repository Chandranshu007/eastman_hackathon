import { products } from "./products";

const categoryDescriptions = {
  Electronics: "Smart tech and useful gadgets for home and on the go.",
  Fashion: "Comfortable everyday styles made to keep you moving.",
  "Home & Living": "Small home comforts and thoughtful everyday upgrades.",
  Accessories: "Practical extras for work, travel, and daily life.",
};

export const categories = [...new Set(products.map((product) => product.category))]
  .map((name) => ({
    name,
    description: categoryDescriptions[name] ?? "Discover useful picks for every day.",
    image: products.find((product) => product.category === name).image,
    productCount: products.filter((product) => product.category === name).length,
  }));
