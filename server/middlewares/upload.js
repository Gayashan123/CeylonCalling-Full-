import express from 'express';
import multer from 'multer';
import Shop from './Shop.js'; // Adjust the path as needed

const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // or configure as needed

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const shopData = req.body;
    if (req.file) {
      shopData.photo = req.file.path; // or upload to cloudinary and use URL
    }
    const newShop = new Shop(shopData);
    const savedShop = await newShop.save();
    res.status(201).json(savedShop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;