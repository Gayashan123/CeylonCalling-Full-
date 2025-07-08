import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100 
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String, // URLs from Cloudinary or local storage
  }],
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SiteUser", 
    required: true 
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlaceCategory"
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

export default mongoose.model("Place", placeSchema);