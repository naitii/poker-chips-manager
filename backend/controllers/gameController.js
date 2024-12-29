import Game from "../models/game.model.js";
import shortid from "shortid";


const createGame = async (req, res) => {
    try {
        const { initialAmount, password, maxPlayers } = req.body;
        let name = shortid.generate();
        name = name.substring(0, 4);
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

const getGame = async (req, res) => {
	try {
        const query = req.params.name;
        const game = await Game.findOne({name: query});
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createGame, getGame };
