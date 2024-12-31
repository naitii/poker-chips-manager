import express from "express";
import * as actionController from "../controllers/actionController.js";

const router = express.Router();

router.post("/placebet", actionController.placebet);
router.post("/raise", actionController.raiseBet);
router.post("/matchbet", actionController.matchBet);

export default router;