import mongoose from "mongoose";

const placeCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 50 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SiteUser",
    required: true
  }
}, { timestamps: true });

// Make category names unique per user
placeCategorySchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model("PlaceCategory", placeCategorySchema);