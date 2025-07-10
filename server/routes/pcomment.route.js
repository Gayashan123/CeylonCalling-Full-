import express from "express";
import Comment from "../models/placecomm.model.js";

import Place from "../models/place.model.js";
import { sessionAuth } from "../middlewares/siteUserAuth.js";
const router = express.Router();

// PUBLIC: Get all comments for a specific place
router.get("/place/:placeId", async (req, res) => {
  try {
    const comments = await Comment.find({ place: req.params.placeId })
      .populate("user", "email name")
      .sort({ createdAt: -1 }); // Newest first
    res.json(comments);
  } catch (error) {
    res.status(500).json([]);
  }
});

// PRIVATE: Get all comments made by the logged-in user
router.get("/my-comments", sessionAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.session.siteuserId })
      .populate("place", "name");
    res.json(comments);
  } catch (error) {
    res.status(500).json([]);
  }
});

router.post("/", sessionAuth, async (req, res) => {
  try {
    const { place, message, rating } = req.body; // Changed from placeId to place
    
    // Validation
    if (!message || !place || !rating) {
      return res.status(400).json({ error: "Message, rating, and place are required." });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const placeExists = await Place.findById(place);
    if (!placeExists) {
      return res.status(404).json({ error: "Place not found." });
    }

    const comment = new Comment({
      message,
      rating,
      user: req.session.siteuserId,
      place,
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