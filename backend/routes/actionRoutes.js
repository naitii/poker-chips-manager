import express from "express";
import * as actionController from "../controllers/actionController.js";

const router = express.Router();

router.post("/placebet", actionController.placebet);
router.post("/raise", actionController.raiseBet);

export default router;