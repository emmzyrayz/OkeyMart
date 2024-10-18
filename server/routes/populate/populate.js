const express = require("express");
const Product = require("../../models/products");
const mongoose = require("mongoose");
const {faker} = require("@faker-js/faker");

// Fixed categories structure to match schema
const categories = [
  {
    name: "Agriculture & Food",
    subcategories: [
      {
        name: "Farm Animals",
        requiredFields: [
          "animalType",
          "age",
          "breed",
          "weight",
          "healthStatus",
        ],
        dropdownOptions: {
          animalType: [
            "Cows",
            "Sheep",
            "Goats",
            "Pigs",
            "Chickens",
            "Fish",
            "Cane Rat",
            "Rabbits",
            "Chinchillas",
            "Ducks",
          ],
          breed: ["Local", "Exotic", "Crossbreed"],
          healthStatus: ["Healthy", "Vaccinated", "Under Treatment"],
        },
      },
      {
        name: "Farm machinery & Equipment",
        requiredFields: [
          "equipmentType",
          "brand",
          "model",
          "condition",
          "color",
        ],
        dropdownOptions: {
          equipmentType: [
            "Tractor",
            "Harvester",
            "Plough",
            "Irrigation System",
            "Cages",
            "Milling Machines",
            "Knapsack Sprayer",
          ],
          brand: ["John Deere", "Massey Ferguson", "New Holland", "Kubota"],
          condition: ["Brand New", "Used", "Seller Refurbished"],
        },
      },
      {
        name: "Feeds, Supplements & Seeds",
        requiredFields: ["type", "weight", "brand", "expiryDate"],
        dropdownOptions: {
          type: ["Feeds", "Plant Seeds", "Supplement"],
          brand: ["Purina", "Royal Canin", "Pioneer Seeds", "Monsanto"],
        },
      },
      {
        name: "Meal & Drink",
        requiredFields: ["type", "litre", "brand", "expiryDate"],
        dropdownOptions: {
          type: ["Bottle", "Can", "Plastic"],
          brand: ["Coca-Cola", "Pepsi", "Nestlé", "Unilever"],
        },
      },
    ],
  },
  // Add other categories following the same structure...
];

const generateCategorySpecificFields = (category, subcategoryName) => {
  const categoryConfig = categories.find((cat) => cat.name === category);
  if (!categoryConfig) return {fieldValues: new Map()};

  const subcategoryConfig = categoryConfig.subcategories.find(
    (sub) => sub.name === subcategoryName
  );
  if (!subcategoryConfig) return {fieldValues: new Map()};

  const fieldValues = new Map();

  // Generate values for each required field
  subcategoryConfig.requiredFields.forEach((field) => {
    const options = subcategoryConfig.dropdownOptions[field];
    if (options) {
      fieldValues.set(field, faker.helpers.arrayElement(options));
    } else {
      // Generate appropriate random values for non-dropdown fields
      switch (field) {
        case "age":
          fieldValues.set(
            field,
            `${faker.number.int({min: 1, max: 10})} months`
          );
          break;
        case "weight":
          fieldValues.set(
            field,
            `${faker.number.int({min: 10, max: 1000})} kg`
          );
          break;
        case "litre":
          fieldValues.set(field, `${faker.number.int({min: 1, max: 20})} L`);
          break;
        case "expiryDate":
          fieldValues.set(
            field,
            faker.date.future().toISOString().split("T")[0]
          );
          break;
        default:
          fieldValues.set(field, faker.commerce.productAdjective());
      }
    }
  });

  return {fieldValues};
};

const populateProducts = async () => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error(
        "Database not connected. Connection state: " +
          mongoose.connection.readyState
      );
    }

    console.log("Starting database population process...");

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products`);

    const products = [];
    const numberOfProducts = 100;

    for (let i = 0; i < numberOfProducts; i++) {
      // Select random category and sub category
      const categoryObj = faker.helpers.arrayElement(categories);
      const subcategoryObj = faker.helpers.arrayElement(
        categoryObj.subcategories
      );

      // Generate category-specific fields
      const categorySpecificFields = generateCategorySpecificFields(
        categoryObj.name,
        subcategoryObj.name
      );

      // Generate images with a specific size
      const images = Array.from({length: 5}, () =>
        faker.image.imageUrl(400, 300, true)
      );
      const mainImage = images[0];

      const product = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        countInStock: faker.number.int({min: 0, max: 100}),
        images,
        mainImage,
        category: categoryObj.name, // Fixed: Using the category name string
        subcategory: subcategoryObj.name, // Fixed: Using the subcategory name string
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

    // Insert products in batches
    const batchSize = 10;
    const batches = Math.ceil(products.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, products.length);
      const batch = products.slice(start, end);

      await Product.insertMany(batch, {ordered: true});
      console.log(`Inserted batch ${i + 1} of ${batches}`);
    }

    console.log("Products populated successfully");
  } catch (error) {
    console.error("Error populating products:", error);
  }
};

const router = express.Router();

router.post("/populate", async (req, res) => {
  try {
    await populateProducts();
    res.status(201).json({
      success: true,
      message: "Products populated successfully",
    });
  } catch (error) {
    console.error("Error populating products:", error);
    res.status(500).json({
      success: false,
      message: "Error populating products",
      error: error.message,
    });
  }
});

module.exports = router;