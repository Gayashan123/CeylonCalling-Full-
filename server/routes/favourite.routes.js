import express from "express";
import { siteUserAuth } from "../middlewares/siteUserAuth.js";
import { getFavourites, addFavourite, removeFavourite } from "../controllers/favourite.controller.js";

const router = express.Router();

router.get("/", siteUserAuth, getFavourites);
router.post("/", siteUserAuth, addFavourite);
router.delete("/:shopId", siteUserAuth, removeFavourite);

export default router;