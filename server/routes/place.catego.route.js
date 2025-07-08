import express from "express";
import Category from "../models/place.category.js";
import { sessionAuth } from "../middlewares/siteUserAuth.js";

const router = express.Router();

// PUBLIC ROUTES (if needed)
// GET all categories (might want to remove or keep as user-specific)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// PRIVATE ROUTES

// GET user's categories
router.get("/user", sessionAuth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.session.siteuserId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST create new category
router.post("/", sessionAuth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check for existing category with same name for this user
    const existingCategory = await Category.findOne({ 
      name, 
      user: req.session.siteuserId 
    });
    
    if (existingCategory) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const category = new Category({
      name,
      user: req.session.siteuserId
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update category
router.put("/:id", sessionAuth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Find category and verify ownership
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.session.siteuserId
    });
    
    if (!category) {
      return res.status(404).json({ error: "Category not found or not authorized" });
    }

    // Check if new name already exists for this user
    const existingCategory = await Category.findOne({
      name,
      user: req.session.siteuserId,
      _id: { $ne: req.params.id }
    });
    
    if (existingCategory) {
      return res.status(409).json({ error: "Category name already exists" });
    }

    category.name = name;
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE category
router.delete("/:id", sessionAuth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.session.siteuserId
    });
    
    if (!category) {
      return res.status(404).json({ error: "Category not found or not authorized" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;