import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  changePassword,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { sessionAuth } from "../middlewares/sessionAuth.js";

const router = express.Router();

router.get("/check-auth", sessionAuth, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/change-password", sessionAuth, changePassword);
router.post("/update-profile", sessionAuth, updateProfile);

export default router;