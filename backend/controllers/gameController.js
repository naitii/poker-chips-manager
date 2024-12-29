const createGame = (req, res) => {
  res.json({ message: "create game route" });
};

const getGame = (req, res) => {
  res.json({ message: "get game route" });
};

export { createGame, getGame };
