import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SiteUser } from "../models/siteUser.model.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

// ENV: JWT_SECRET, CLIENT_URL
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Helper: create JWT
const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, isVerified: user.isVerified },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

// ============================
// SIGNUP
// ============================
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existingUser = await SiteUser.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await SiteUser.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// VERIFY EMAIL
// ============================
export const verifyEmail = async (req, res) => {
  const { code, email } = req.body;
  try {
    const user = await SiteUser.findOne({
      email,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired code" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    // Issue JWT
    const token = signToken(user);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// LOGIN
// ============================
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await SiteUser.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(400).json({ success: false, message: "Email is not verified" });

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// SEND FORGOT PASSWORD EMAIL
// ============================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await SiteUser.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ success: true, message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// RESET PASSWORD
// ============================
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await SiteUser.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

    user.password = await bcryptjs.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// CHECK AUTH (JWT Protected)
// ============================
export const checkAuth = async (req, res) => {
  try {
    const user = await SiteUser.findById(req.user.id).select("-password");
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============================
// CHANGE PASSWORD (Protected)
// ============================
export const changePassword = async (req, res) => {
  const userId = req.user.id; // <- updated
  const { currentPassword, newPassword } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await SiteUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Prevent setting the same password again
    const isSame = await bcryptjs.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ success: false, message: "New password must be different from the current password" });
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log("Error in changePassword:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// ============================
// UPDATE PROFILE (Protected)
// ============================
export const updateProfile = async (req, res) => {
  const userId = req.user.id; // <- updated
  const { name, email } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if email is already used by another user
    const existingUser = await SiteUser.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already taken" });
    }

    const user = await SiteUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};