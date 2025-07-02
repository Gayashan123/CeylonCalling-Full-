import { SiteUser } from "../models/siteUser.model.js";

export const getFavourites = async (req, res) => {
  try {
    const user = await SiteUser.findById(req.user.id).populate("favourites");
    res.json(user.favourites || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to get favourites" });
  }
};

export const addFavourite = async (req, res) => {
  try {
    const { shopId } = req.body;
    await SiteUser.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favourites: shopId } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add favourite" });
  }
};

export const removeFavourite = async (req, res) => {
  try {
    const { shopId } = req.params;
    await SiteUser.findByIdAndUpdate(
      req.user.id,
      { $pull: { favourites: shopId } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favourite" });
  }
};