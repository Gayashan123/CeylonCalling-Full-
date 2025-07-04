import { SiteUser } from "../models/siteUser.model.js";
import Shop from "../models/Shop.js";

// Fetch all favourite shops (populated)
export const getFavourites = async (req, res) => {
  try {
    const user = await SiteUser.findById(req.user.id).populate("favourites");
    res.json(user && user.favourites ? user.favourites : []);
  } catch (err) {
    res.status(500).json({ error: "Failed to get favourites" });
  }
};

// Add a shop to favourites
export const addFavourite = async (req, res) => {
  try {
    const { shopId } = req.body;
    await SiteUser.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favourites: shopId } },
      { new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add favourite" });
  }
};

// Remove a shop from favourites
export const removeFavourite = async (req, res) => {
  try {
    const { shopId } = req.params;
    await SiteUser.findByIdAndUpdate(
      req.user.id,
      { $pull: { favourites: shopId } },
      { new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favourite" });
  }
};