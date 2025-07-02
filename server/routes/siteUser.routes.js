import express from "express";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/siteUser.controller.js";
import { siteUserAuth } from "../middlewares/siteUserAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", siteUserAuth, checkAuth);

export default router;