import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./config/connectToDb.js";
import shopRoutes from "./routes/shopRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/auth.route.js";

// __dirname fix for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables
dotenv.config({ path: path.join(__dirname, "config", ".env") });

// Safety checks
if (!process.env.DB_URL) throw new Error("DB_URL is not set in .env!");
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set in .env!");

const app = express();

// CORS for local dev (adjust for prod)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// SESSION SETUP (MongoDB-backed)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: false,       // FOR LOCAL DEV ONLY (set true for HTTPS in prod)
      sameSite: "lax",     // FOR LOCAL DEV ONLY
    },
  })
);

// Uploads (for files/images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple test endpoint
app.get("/", (req, res) => {
  res.json({ hello: "World" });
});

// API Routes
app.use("/api/shops", shopRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/auth", authRoutes);

// Frontend (PRODUCTION ONLY)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/my-app/dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "my-app", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

// Startup: connect DB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB, server not started.", err);
    process.exit(1);
  });