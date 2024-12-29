import Game from "../models/game.model.js";
import Player from "../models/player.model.js";
import shortid from "shortid";

const createGame = async (req, res) => {
  try {
    const { initialAmount, password, maxPlayers, userDetails } = req.body;
    const { name: userName } = userDetails;
    const name = shortid.generate().substring(0, 4);

    if (!initialAmount || !password || !userDetails || !userName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newPlayer = new Player({
      name: userName,
      amount: initialAmount,
    });

    await newPlayer.save();

    const newGame = new Game({
      initialAmount,
      name,
      password,
      maxPlayers,
      players: [newPlayer],
    });

    await newGame.save();
    res.status(200).json(newGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGame = async (req, res) => {
  try {
    const query = req.params.name;
    const game = await Game.findOne({ name: query });
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinGame = async (req, res) => {
  try {
    const { gameId, password, userDetails } = req.body;
    const { name: userName } = userDetails;

    if (!password || !userDetails || !userName) {
      res
        .status(400)
        .json({ message: "Missing required fields.", boddy: { ...req.body } });
    }

    const game = await Game.findOne({ name: gameId, password: password });

    if (!game) {
      res.status(404).json({ message: "Game Not Found." });
    }

    const newPlayer = new Player({
      name: userName,
      amount: game.initialAmount,
    });

    await newPlayer.save();

    game.players.push(newPlayer._id);
    await game.save();

    const populatedGame = await Game.findById(game._id).populate("players");

    res.status(200).json(populatedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createGame, getGame, joinGame };
