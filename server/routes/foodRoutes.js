import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import FoodItem from "../models/Addfood.js";
import Shop from "../models/Shop.js";
import Category from "../models/Category.js";
import { sessionAuth } from "../middlewares/sessionAuth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- PUBLIC ROUTES ---

// GET: All food items for a specific shop (PUBLIC)
router.get("/shop/:shopId", async (req, res) => {
  try {
    const foods = await FoodItem.find({ shop: req.params.shopId }).populate("category");
    res.json(foods);
  } catch (error) {
    res.status(500).json([]);
  }
});

// GET: All food items (publicly accessible)
router.get("/all", async (req, res) => {
  try {
    const foods = await FoodItem.find().populate("category").populate("shop", "name");
    res.json(foods);
  } catch (error) {
    console.error("Error fetching all foods:", error);
    res.status(500).json({ error: "Failed to fetch all food items." });
  }
});

// GET: All categories (publicly accessible)
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories." });
  }
});

// --- PRIVATE ROUTES ---

// GET: All food items for current user's shop (PRIVATE)
router.get("/my-shop", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(404).json([]);
    const foods = await FoodItem.find({ shop: shop._id }).populate("category");
    res.json(foods);
  } catch (error) {
    res.status(500).json([]);
  }
});

// GET: All categories for current user's shop (PRIVATE)
router.get("/my-shop/categories", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(404).json([]);
    const categories = await Category.find({ shop: shop._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json([]);
  }
});

// POST: Add new food item for current user's shop (PRIVATE)
router.post("/", sessionAuth, upload.single("picture"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(403).json({ error: "No shop for user" });

    const { name, categoryId, price } = req.body;
    if (!name || !categoryId || !price)
      return res.status(400).json({ error: "Name, categoryId, and price are required." });

    const picture = req.file ? `/uploads/${req.file.filename}` : undefined;

    const foodItem = new FoodItem({
      name: name.trim(),
      category: categoryId,
      price: Number(price),
      picture,
      shop: shop._id,
    });

    await foodItem.save();
    await foodItem.populate("category");
    res.status(201).json(foodItem);
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update food item for current user's shop (PRIVATE)
router.put("/:id", sessionAuth, upload.single("picture"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(403).json({ error: "No shop for user" });

    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.categoryId !== undefined) updateData.category = req.body.categoryId;
    if (req.file) {
      updateData.picture = `/uploads/${req.file.filename}`;
    } else if (req.body.picture === "") {
      updateData.picture = undefined;
    }

    const updatedFood = await FoodItem.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      updateData,
      { new: true, runValidators: true }
    ).populate("category");

    if (!updatedFood) {
      return res.status(404).json({ error: "Food item not found or not belonging to your shop." });
    }
    res.status(200).json(updatedFood);
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove food item for current user's shop (PRIVATE)
router.delete("/:id", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(403).json({ error: "No shop for user" });

    const deleted = await FoodItem.findOneAndDelete({ _id: req.params.id, shop: shop._id });
    if (!deleted) return res.status(404).json({ error: "Food item not found or not belonging to your shop." });
    res.json({ message: "Food item deleted." });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;