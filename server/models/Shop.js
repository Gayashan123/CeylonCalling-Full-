import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    activeTime: { type: String, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    photo: { type: String },
    priceRange: { type: String, trim: true },
    shopType: { type: String, enum: ['restaurant', 'small_food_shop', 'hotel'], required: true },
    contact: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviews: [
      {
        name: String,
        rating: Number,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;