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

// CORS configuration
app.use(
cors({
origin: "http://localhost:5173",
credentials: true,
methods: ["GET", "POST", "PUT", "DELETE"],
allowedHeaders: ["Content-Type", "Authorization"],
})
);

app.use(express.json());
app.use(cookieParser());

// Enhanced session configuration
app.use(
session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false,
store: MongoStore.create({
mongoUrl: process.env.DB_URL,
collectionName: "sessions",
ttl: 7 * 24 * 60 * 60, // 7 days
}),
cookie: {
httpOnly: true,
maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
secure: process.env.NODE_ENV === "production",
sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
},
})
);

// Uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test endpoint
app.get("/", (req, res) => {
res.json({
status: "Server running",
session: req.session,
user: req.user
});
});

// API Routes
app.use("/api/shops", shopRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/auth", authRoutes);

// Frontend serving (PRODUCTION ONLY)
if (process.env.NODE_ENV === "production") {
const clientDistPath = path.join(__dirname, "../../client/dist"); // Adjusted path

// Serve static assets
app.use(express.static(clientDistPath));

// Handle SPA routing
app.get("*", (req, res) => {
res.sendFile(path.join(clientDistPath, "index.html"));
});
}

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB()
.then(() => {
app.listen(PORT, () => {
console.log(`✅ Server running on http://localhost:${PORT}`);
console.log(`✅ Session secret: ${process.env.SESSION_SECRET ? "Set" : "Missing!"}`);
console.log(`✅ Serving static files from: ${path.join(__dirname, "../../client/dist")}`);
});
})
.catch((err) => {
console.error("❌ Failed to connect to DB, server not started.", err);
process.exit(1);
});

