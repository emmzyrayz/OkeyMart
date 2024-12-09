const Product = require('../models/productModel');

// Fetch all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            image: req.body.image,
            stock: req.body.stock,
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};