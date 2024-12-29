import Game from "../models/game.model.js";
import shortid from "shortid";


const createGame = async (req, res) => {
    try {
        const { initialAmount, password, maxPlayers } = req.body;
        const name = shortid.generate();
        const newGame = new Game({
          initialAmount,
          name,
          password,
          maxPlayers,
        });
        await newGame.save();
        res.status(200).json(newGame);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGame = (req, res) => {
	res.json({ message: "get game route" });  
};

export { createGame, getGame };
