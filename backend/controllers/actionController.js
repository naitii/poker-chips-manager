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
    if(game.currentBet >0){
        return res.status(400).json({ message: "Cannot place bet when there is already a bet" });
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

const leaveGame = async (req, res) => {
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
        if (game.currentRoundWinner === playerName) {
            game.currentRoundWinner = "";
        }
        game.players = game.players.filter((player) => player.name !== playerName);
        await game.save();
        return res.status(200).json(game);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const callOfWinner = async (req, res) => {
    try {
        const { gameName, playerName, winnerName } = req.body;
        if (!gameName || !playerName ) {
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
        const winner = game.players.find((player) => player.name === winnerName);
        if (!winner) {
            if(winnerName !== "") {
                return res.status(404).json({ message: "Winner not found" });
            }
        }
        game.currentRoundWinner = winnerName;
        for (let pl of game.players) {
            if (pl.name !== playerName) {
                pl.acceptWinner = false;
                await pl.save();
            }
        }
        if(winnerName !== ""){
            player.acceptWinner = true;
        }
        await player.save();
        await game.save();
        return res.status(200).json(game);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const voteForWinner = async (req, res) => {
    try {
        const { gameName, playerName, vote } = req.body;
        if (!gameName || !playerName || vote === undefined) {
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
        if (game.currentRoundWinner === "") {
            return res.status(400).json({ message: "Winner not declared" });
        }
        if (vote) {
            player.acceptWinner = true;
        } else {
            player.acceptWinner = false;
        }
        await player.save();
        return res.status(200).json(game);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const declareWinnerOfRound = async (req, res) => {
    try {
        const { gameName } = req.body;
        if (!gameName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const game = await Game.findOne({ name: gameName }).select("-password").populate("players");
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        const unacceptedPlayer = game.players.find(
          (pl) => pl.acceptWinner === false
        );

        if (unacceptedPlayer) {
          return res
            .status(400)
            .json({
              message: `${unacceptedPlayer.name} has not accepted the winner`,
            });
        }
        const winner_name = game.currentRoundWinner;
        const player = game.players.find((player) => player.name === winner_name);
        if(player==="" || !player){
            return res.status(400).json({ message: "Winner's name not provided" });
        }
        player.amount += game.pot;
        game.pot = 0;
        game.currentBet = 0;
        for (let pl of game.players) {
            pl.acceptWinner = false;
            await pl.save();
        }
        game.currentRoundWinner = "";
        await player.save();
        await game.save();
       return res.status(200).json(game);  
    } catch (error) {
       return res.status(500).json({ message: error.message });
    }
};

export { placebet, raiseBet, matchBet, declareWinnerOfRound, callOfWinner, voteForWinner, leaveGame };