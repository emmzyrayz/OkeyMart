const express = require("express");
const Category = require("../models/category");
const mongoose = require("mongoose");
const router = express.Router();

// Route: Fetch all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({message: "Error fetching categories", error});
  }
});

// Route: Fetch category by ID
router.get("/:id", async (req, res) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({message: "Invalid category ID"});
  }

  try {
    const category = await Category.findById(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({message: "Category not found"});
    }
  } catch (error) {
    res.status(500).json({message: "Error fetching category", error});
  }
});

// Route: Add a new category
router.post("/", async (req, res) => {
  const {name, description} = req.body;

  try {
    const category = new Category({name, description});
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({message: "Error creating category", error});
  }
});

// Route: Update a category
router.put("/:id", async (req, res) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({message: "Invalid category ID"});
  }

  const {name, description} = req.body;

  try {
    const category = await Category.findById(id);

    if (category) {
      category.name = name || category.name;
      category.description = description || category.description;
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({message: "Category not found"});
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({message: "Error updating category", error});
  }
});

// Route: Delete a category
router.delete("/:id", async (req, res) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({message: "Invalid category ID"});
  }

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (deletedCategory) {
      res.json({message: "Category deleted"});
    } else {
      res.status(404).json({message: "Category not found"});
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({message: "Error deleting category", error});
  }
});

// Route: Delete all categories
router.delete("/", async (req, res) => {
  try {
    await Category.deleteMany({});
    res.json({message: "All categories deleted successfully"});
  } catch (error) {
    res.status(500).json({message: "Error deleting categories", error});
  }
});

module.exports = router;