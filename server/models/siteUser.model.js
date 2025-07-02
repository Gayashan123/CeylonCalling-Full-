import mongoose from "mongoose";

const siteUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    lastLogin: { type: Date, default: Date.now },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }]
  },
  { timestamps: true }
);

export const SiteUser = mongoose.model("SiteUser", siteUserSchema);