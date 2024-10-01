const mongoose = require("mongoose");
const {faker} = require("@faker-js/faker");
const Product = require("./models/products"); // Adjust the path to your Product model

const populateProducts = async () => {
  // Connect to your MongoDB database
  await mongoose.connect(
    "mongodb+srv://okeyinterrupt:SUVH2khm2So8WzeW@okeymart-dev.2dxat.mongodb.net/okey-mart?retryWrites=true&w=majority"
    // mongodb+srv://okeyinterrupt:SUVH2khm2So8WzeW@okeymart-dev.2dxat.mongodb.net/okay_mart?retryWrites=true&w=majority
  );

  const db = mongoose.connection;
  console.log("Connected to database:", db.name);


  // Clear existing products
  await Product.deleteMany({});

  const products = [];

  const categories = [
    {
      main: "Electronics",
      sub: ["Gadgets", "Mobile Devices", "Smartphones", "Apple", 'watches', "camera", 'mouse', 'Drives'],
    },
    {main: "Home Appliances", sub: ["Kitchen", "Cleaning", "Heating"]},
    {main: "Computers", sub: ["Laptops", "Desktops", "Tablets", "Accessories"]},
    {main: 'Beauty & Personal Care', sub: ['face cream', 'hand cream', 'soap', 'hair cream']}
    // Add more category structures as necessary
  ];

  const conditions = ["New", "Refurbished", "Used"];

  for (let i = 0; i < 100; i++) {
    // Randomly select a main category and its subcategories
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategories = faker.helpers.arrayElements(category.sub, 3); // Select up to 3 subcategories

    // Generate filterable attributes
    const filters = {
      color: faker.color.human(), // Random color
      ram: `${faker.number.int({min: 2, max: 16})} GB`, // Random RAM size
      rom: `${faker.number.int({min: 32, max: 512})} GB`, // Random ROM size
      condition: faker.helpers.arrayElement(conditions), // Random condition (New, Refurbished, Used)
    };

    // Generate 5 random image URLs
    const images = Array.from({length: 5}, () => faker.image.avatar());

    // Randomly pick one image from the 5 images as the main image
    const mainImage = faker.helpers.arrayElement(images);

    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()), // Convert to float
      countInStock: faker.number.int({min: 0, max: 100}),
      images, // The array of 5 random images
      mainImage,
      category: [category.main, ...subCategories], // Main category + subcategories
      filters, // Add filterable attributes like color, RAM, ROM, etc.
      createdAt: new Date(),
      discount: faker.number.int({min: 0, max: 50}), // Random discount
      featured: faker.datatype.boolean(),
      trending: faker.datatype.boolean(),
      top: faker.datatype.boolean(),
      today: faker.datatype.boolean(),
      rating: parseFloat(faker.number.float({min: 0, max: 5, precision: 0.1})),
      liked: faker.datatype.boolean(),
      viewed: faker.datatype.boolean(),
      // Add any additional fields here if necessary
    });
  }

  // Insert the generated products into the database
  try {
    await Product.insertMany(products);
    console.log("Products populated successfully!");
  } catch (error) {
    console.error("Error inserting products:", error);
  }

  // Close the MongoDB connection
  await mongoose.connection.close();
};

populateProducts().catch((error) => {
  console.error("Error connecting to MongoDB", error);
});
