import express from "express";
import * as actionController from "../controllers/actionController.js";

const router = express.Router();

router.post("/placebet", actionController.placebet);
router.post("/raise", actionController.raiseBet);
router.post("/matchbet", actionController.matchBet);
router.post("/callwinner", actionController.callOfWinner);
router.post("/vote", actionController.voteForWinner);
router.post("/declarewinner", actionController.declareWinnerOfRound);
router.post("/leavegame", actionController.leaveGame);

export default router;