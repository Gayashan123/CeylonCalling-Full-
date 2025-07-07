import express from "express";
import Comment from "../models/comment.model.js";
import Shop from "../models/Shop.js";
import { sessionAuth } from "../middlewares/siteUserAuth.js";
const router = express.Router();

// PUBLIC: Get all comments for a specific shop
router.get("/shop/:shopId", async (req, res) => {
  try {
    const comments = await Comment.find({ shop: req.params.shopId })
      .populate("user", "email name");
    res.json(comments);
  } catch (error) {
    res.status(500).json([]);
  }
});

// PRIVATE: Get all comments made by the logged-in user
router.get("/my-comments", sessionAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.session.siteuserId })
      .populate("shop", "name");
    res.json(comments);
  } catch (error) {
    res.status(500).json([]);
  }
});

// PRIVATE: Add a comment to a shop
router.post("/", sessionAuth, async (req, res) => {
  try {
    const { shopId, message, rating } = req.body;
    if (!message || !shopId || !rating) {
      return res.status(400).json({ error: "Message, rating, and shopId are required." });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ error: "Shop not found." });

    const comment = new Comment({
      message,
      rating,
      user: req.session.siteuserId,
      shop: shop._id,
    });

    await comment.save();
    await comment.populate("user", "email name");
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PRIVATE: Delete a comment made by the current user
router.delete("/:id", sessionAuth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.session.siteuserId,
    });

    if (!comment) return res.status(404).json({ error: "Comment not found." });
    res.json({ message: "Comment deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;