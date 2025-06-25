import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// __dirname fix for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "config", ".env") });
}

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error in verifyToken", error);
    return res.status(401).json({ success: false, message: "Unauthorized - invalid or expired token" });
  }
};