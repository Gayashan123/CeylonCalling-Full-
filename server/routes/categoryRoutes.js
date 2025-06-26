import express from "express";
import Category from "../models/Category.js";
import Shop from "../models/Shop.js";
import { sessionAuth } from "../middlewares/sessionAuth.js";

const router = express.Router();

// GET: Get all categories for current user's shop (PRIVATE)
router.get("/my-shop", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(404).json([]);
    const categories = await Category.find({ shop: shop._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json([]);
  }
});

// POST: Create category for current user's shop (PRIVATE)
router.post("/", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(403).json({ error: "No shop for user" });

    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required." });
    }
    const existing = await Category.findOne({ name: name.trim(), shop: shop._id });
    if (existing) return res.status(409).json({ error: "Category already exists." });

    const category = new Category({ name: name.trim(), shop: shop._id });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", sessionAuth, async (req, res) => {
  try {
    // ...your update logic...
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        category: req.body.categoryId || null,
        // handle image, etc...
      },
      { new: true }
    ).populate("category"); // <--- this is crucial!

    if (!food) return res.status(404).json({ error: "Food not found" });
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a category by ID (PRIVATE)
router.delete("/:id", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(403).json({ error: "No shop for user" });

    const deleted = await Category.findOneAndDelete({ _id: req.params.id, shop: shop._id });
    if (!deleted) return res.status(404).json({ error: "Category not found." });
    res.json({ message: "Category deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




export default router;