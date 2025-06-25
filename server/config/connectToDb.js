// db.js or connectToDb.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// These are needed because __dirname is not available in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env only if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, ".env") });
}

async function connectToDb() {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(
      `✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export default connectToDb;
