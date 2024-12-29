import Game from "../models/game.model.js";

const placebet = async (req, res) => {
    try {
        const { gameName, playerName, betAmount } = req.body;
        if (!gameName || !playerName || !betAmount) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if(betAmount <= 0) {
            return res.status(400).json({ message: "Bet amount cannot be negative" });
        }
        const game = await Game.findOne({ name: gameName });
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        const player = game.players.find((player) => player.name === playerName);
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        if (player.amount < betAmount) {
            return res.status(400).json({ message: "Not enough balance" });
        }
        player.amount -= betAmount;
        game.pot += betAmount;
        game.currentBet = betAmount;
        await game.save();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const raiseBet = async (req, res) => {
    try {
        const { gameName, playerName, raise } = req.body;
        if (!gameName || !playerName || !betAmount) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if(raise <= 0) {
            return res.status(400).json({ message: "Bet amount cannot be negative" });
        }
        const game = await Game.findOne({ name: gameName });
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        const player = game.players.find((player) => player.name === playerName);
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        if (player.amount < raise+game.currentBet) {
            return res.status(400).json({ message: "Not enough balance" });
        }
        player.amount -= raise+game.currentBet;
        game.pot += raise+game.currentBet;
        game.currentBet += raise;
        await game.save();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { placebet, raiseBet };