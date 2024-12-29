import express from "express";
import * as gameController from "../controllers/gameController.js";

const router = express.Router();

router.post("/create", gameController.createGame);
router.get("/:name", gameController.getGame);

export default router;