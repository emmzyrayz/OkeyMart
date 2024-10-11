const express = require("express");
const Product = require("../models/products");
const {faker} = require("@faker-js/faker");
const router = express.Router();

// Import your category configuration
const categories = [
  {
    name: "Agriculture & Food",
    subcategories: [
      "Farm Animals",
      "Farm machinery & Equipment",
      "Feeds, Supplements & Seeds",
      "Meal & Drink",
    ],
  },
  {
    name: "Babies & Kid",
    subcategories: ["Children's Clothing", "Children's Furniture"],
  },
  {
    name: "Electronics",
    subcategories: ["Laptops & Computers"],
  },
  // Add other categories as needed
];

const generateCategorySpecificFields = (category, subcategory) => {
  switch (category) {
    case "Agriculture & Food":
      switch (subcategory) {
        case "Farm Animals":
          return {
            fieldValues: new Map([
              [
                "animalType",
                faker.helpers.arrayElement([
                  "Cows",
                  "Sheep",
                  "Goats",
                  "Pigs",
                  "Chickens",
                  "Fish",
                ]),
              ],
              ["age", faker.number.int({min: 1, max: 10}) + " months"],
              [
                "breed",
                faker.helpers.arrayElement(["Local", "Exotic", "Crossbreed"]),
              ],
              ["weight", faker.number.int({min: 10, max: 1000}) + " kg"],
              [
                "healthStatus",
                faker.helpers.arrayElement([
                  "Healthy",
                  "Vaccinated",
                  "Under Treatment",
                ]),
              ],
            ]),
          };
        case "Farm machinery & Equipment":
          return {
            fieldValues: new Map([
              [
                "equipmentType",
                faker.helpers.arrayElement([
                  "Tractor",
                  "Harvester",
                  "Plough",
                  "Irrigation System",
                ]),
              ],
              [
                "brand",
                faker.helpers.arrayElement([
                  "John Deere",
                  "Massey Ferguson",
                  "New Holland",
                  "Kubota",
                ]),
              ],
              ["model", faker.vehicle.model()],
              [
                "condition",
                faker.helpers.arrayElement([
                  "Brand New",
                  "Used",
                  "Seller Refurbished",
                ]),
              ],
              ["color", faker.color.human()],
            ]),
          };
        // Add other subcategories
        default:
          return {fieldValues: new Map()};
      }

    case "Electronics":
      return {
        fieldValues: new Map([
          [
            "brand",
            faker.helpers.arrayElement(["Apple", "Dell", "HP", "Lenovo"]),
          ],
          [
            "processor",
            faker.helpers.arrayElement([
              "Intel i3",
              "Intel i5",
              "Intel i7",
              "AMD Ryzen",
            ]),
          ],
          ["ram", faker.helpers.arrayElement(["4GB", "8GB", "16GB", "32GB"])],
          ["storage", faker.helpers.arrayElement(["256GB", "512GB", "1TB"])],
          [
            "screenSize",
            faker.helpers.arrayElement(['13"', '14"', '15.6"', '17"']),
          ],
        ]),
      };

    default:
      return {fieldValues: new Map()};
  }
};

// Route: Populate database with fake products
router.post("/populate", async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    const products = [];
    const numberOfProducts = 50; // Adjust as needed

    for (let i = 0; i < numberOfProducts; i++) {
      // Select random category and subcategory
      const categoryObj = faker.helpers.arrayElement(categories);
      const category = categoryObj.name;
      const subcategory = faker.helpers.arrayElement(categoryObj.subcategories);

      // Generate category-specific fields
      const categorySpecificFields = generateCategorySpecificFields(
        category,
        subcategory
      );

      // Generate 5 unique fake images
      const images = Array.from({length: 5}, () => faker.image.url());
      const mainImage = faker.helpers.arrayElement(images);

      const product = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        countInStock: faker.number.int({min: 0, max: 100}),
        images,
        mainImage,
        category,
        subcategory,
        categorySpecificFields,
        createdAt: faker.date.past(),
        discount: faker.number.int({min: 0, max: 50}),
        featured: faker.datatype.boolean(),
        trending: faker.datatype.boolean(),
        top: faker.datatype.boolean(),
        today: faker.datatype.boolean(),
        rating: parseFloat(
          faker.number.float({min: 0, max: 5, precision: 0.1})
        ),
      };

      products.push(product);
    }

    // Insert all products
    await Product.insertMany(products);
    res.status(201).json({
      message: "Products populated successfully",
      count: products.length,
    });
  } catch (error) {
    console.error("Error populating products:", error);
    res.status(500).json({message: "Error populating products", error});
  }
});

module.exports = router;
