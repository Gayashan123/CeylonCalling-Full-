import express from "express";
import { siteUserAuth } from "../middlewares/siteUserAuth.js";
import { getFavourites, addFavourite, removeFavourite } from "../controllers/favourite.controller.js";

const router = express.Router();

router.get("/favourites", siteUserAuth, getFavourites);
router.post("/favourites", siteUserAuth, addFavourite);
router.delete("/favourites/:shopId", siteUserAuth, removeFavourite);

export default router;