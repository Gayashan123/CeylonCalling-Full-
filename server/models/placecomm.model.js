// placecomm.model.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "SiteUser", required: true },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PlaceComment || mongoose.model("PlaceComment", commentSchema);
