import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Place from "../models/place.model.js";
import { sessionAuth } from "../middlewares/siteUserAuth.js";
import fs from "fs";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to handle file uploads
const handleFileUpload = (req, res, next) => {
  const uploadMiddleware = upload.array('images', 5); // Max 5 images
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
};

// Create new place
router.post("/", sessionAuth, handleFileUpload, async (req, res) => {
  try {
    const { title, description, location, categories } = req.body;
    
    if (!title || !location) {
      return res.status(400).json({ 
        success: false,
        error: "Title and location are required" 
      });
    }

    const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];

    const place = new Place({
      title,
      description,
      location,
      images: imagePaths,
      categories: Array.isArray(categories) ? categories : [categories],
      user: req.session.siteuserId
    });

    await place.save();
    
    res.status(201).json({ 
      success: true,
      message: "Place created successfully",
      data: place 
    });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files?.length) {
      req.files.forEach(file => {
        fs.unlink(path.join(uploadDir, file.filename), () => {});
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find()
      .populate("user", "username email")
      .populate("categories", "name");
      
    res.json({ 
      success: true,
      data: places 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch places" 
    });
  }
});

// Get single place
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate("user", "username email")
      .populate("categories", "name");
      
    if (!place) {
      return res.status(404).json({ 
        success: false,
        error: "Place not found" 
      });
    }
    
    res.json({ 
      success: true,
      data: place 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch place" 
    });
  }
});

// Update place
router.put("/:id", sessionAuth, handleFileUpload, async (req, res) => {
  try {
    const { title, description, location, categories } = req.body;
    
    const place = await Place.findOne({
      _id: req.params.id,
      user: req.session.siteuserId
    });
    
    if (!place) {
      return res.status(404).json({ 
        success: false,
        error: "Place not found or not authorized" 
      });
    }

    // Update fields
    place.title = title || place.title;
    place.description = description || place.description;
    place.location = location || place.location;
    
    if (categories) {
      place.categories = Array.isArray(categories) ? categories : [categories];
    }

    // Handle new images
    if (req.files?.length) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      place.images = [...place.images, ...newImages].slice(0, 5); // Keep max 5 images
    }

    await place.save();
    
    res.json({ 
      success: true,
      message: "Place updated successfully",
      data: place 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Delete place
router.delete("/:id", sessionAuth, async (req, res) => {
  try {
    const place = await Place.findOneAndDelete({
      _id: req.params.id,
      user: req.session.siteuserId
    });

    if (!place) {
      return res.status(404).json({ 
        success: false,
        error: "Place not found or not authorized" 
      });
    }

    // Delete associated images
    place.images.forEach(image => {
      if (image.startsWith('/uploads/')) {
        const filename = image.replace('/uploads/', '');
        fs.unlink(path.join(uploadDir, filename), () => {});
      }
    });

    res.json({ 
      success: true,
      message: "Place deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;