import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Shop from "../models/Shop.js";
import { sessionAuth } from "../middlewares/sessionAuth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- NEW PUBLIC ENDPOINT ---
router.get("/all", async (req, res) => {
  try {
    const shops = await Shop.find().select("-owner -reviews"); // Exclude sensitive info if needed
    res.json({ shops });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

// GET: Get the current user's shop (PRIVATE)
router.get("/my-shop", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(404).json({ shop: null });
    res.json({ shop });
  } catch (error) {
    res.status(500).json({ shop: null });
  }
});

// POST: Create new shop (PRIVATE)
router.post("/", sessionAuth, upload.single("photo"), async (req, res) => {
  try {
    const shopData = req.body;
    shopData.owner = req.session.userId;
    if (req.file) {
      shopData.photo = `/uploads/${req.file.filename}`;
    }
    // Prevent duplicate shop per user (optional)
    const existingShop = await Shop.findOne({ owner: req.session.userId });
    if (existingShop) {
      return res.status(400).json({ error: "User already owns a shop." });
    }
    const newShop = new Shop(shopData);
    const savedShop = await newShop.save();
    res.status(201).json(savedShop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update shop by ID (PRIVATE)
router.put("/:id", sessionAuth, upload.single("photo"), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    if (!shop.owner.equals(req.session.userId)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const updateData = req.body;
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }
    const updatedShop = await Shop.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedShop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;