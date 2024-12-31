import Game from "../models/game.model.js";

const placebet = async (req, res) => {
  try {
    const { gameName, playerName, betAmount } = req.body;

    if (!gameName || !playerName || !betAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (betAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Bet amount cannot be negative or zero" });
    }

    const game = await Game.findOne({ name: gameName }).populate("players").select("-password");

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
    await player.save();
    game.pot += betAmount;
    game.currentBet = betAmount;

    await game.save();
    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const raiseBet = async (req, res) => {
    try {
        const { gameName, playerName, raise } = req.body;
        if (!gameName || !playerName || !raise) {
             return res.status(400).json({ message: "All fields are required" });
        }
        if(raise <= 0) {
             return res.status(400).json({ message: "Raise cannot be negative or zero" });
        }
        const game = await Game.findOne({ name: gameName }).select("-password").populate("players");
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
        await player.save();
        await game.save();
        return res.status(200).json(game);  
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const matchBet = async (req, res) => {
    try {
        const { gameName, playerName } = req.body;
        if (!gameName || !playerName) {
             return res.status(400).json({ message: "All fields are required" });
        }
        const game = await Game.findOne({ name: gameName }).select("-password").populate("players");
        if (!game) {
             return res.status(404).json({ message: "Game not found" });
        }
        const player = game.players.find((player) => player.name === playerName);
        if (!player) {
             return res.status(404).json({ message: "Player not found" });
        }
        if (player.amount < game.currentBet) {
             return res.status(400).json({ message: "Not enough balance" });
        }
        player.amount -= game.currentBet;
        game.pot += game.currentBet;
        await player.save();
        await game.save();
        return res.status(200).json(game);  
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { placebet, raiseBet, matchBet };