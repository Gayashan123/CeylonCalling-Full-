import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  { timestamps: true }
);

// For hot-reload safety
export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);