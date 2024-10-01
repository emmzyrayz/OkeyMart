// pages/api/populate.js

import dbConnect from "../../../lib/dbconnect";
import Product from "../../../models/product";
import {faker} from "@faker-js/faker";

const populateProducts = async () => {
  await dbConnect();

  // Clear existing products
  await Product.deleteMany({});

  const products = [];
  const categories = [
    {
      main: "Electronics",
      sub: [
        "Gadgets",
        "Mobile Devices",
        "Smartphones",
        "Apple",
        "watches",
        "camera",
        "mouse",
        "Drives",
      ],
    },
    {main: "Home Appliances", sub: ["Kitchen", "Cleaning", "Heating"]},
    {main: "Computers", sub: ["Laptops", "Desktops", "Tablets", "Accessories"]},
    {
      main: "Beauty & Personal Care",
      sub: ["face cream", "hand cream", "soap", "hair cream"],
    },
  ];
  const conditions = ["New", "Refurbished", "Used"];

  for (let i = 0; i < 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategories = faker.helpers.arrayElements(category.sub, 3);
    const filters = {
      color: faker.color.human(),
      ram: `${faker.number.int({min: 2, max: 16})} GB`,
      rom: `${faker.number.int({min: 32, max: 512})} GB`,
      condition: faker.helpers.arrayElement(conditions),
    };
    const images = Array.from({length: 5}, () => faker.image.avatar());
    const mainImage = faker.helpers.arrayElement(images);

    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      countInStock: faker.number.int({min: 0, max: 100}),
      images,
      mainImage,
      category: [category.main, ...subCategories],
      filters,
      createdAt: new Date(),
      discount: faker.number.int({min: 0, max: 50}),
      featured: faker.datatype.boolean(),
      trending: faker.datatype.boolean(),
      top: faker.datatype.boolean(),
      today: faker.datatype.boolean(),
      rating: parseFloat(faker.number.float({min: 0, max: 5, precision: 0.1})),
      liked: faker.datatype.boolean(),
      viewed: faker.datatype.boolean(),
    });
  }

  await Product.insertMany(products);
  console.log("Products populated successfully!");
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await populateProducts();
      return res
        .status(200)
        .json({message: "Products populated successfully!"});
    } catch (error) {
      console.error("Error populating products:", error);
      return res
        .status(500)
        .json({message: "Error populating products", error});
    }
  } else {
    return res.status(405).json({message: "Method not allowed"});
  }
}