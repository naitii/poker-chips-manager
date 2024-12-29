import User from "../model/player.model.js";
const addUser = async (req, res) => {
  const userData = req.body;

  if (!userData || !userData.name) {
    res.status(400).json({ message: "Invalid data" });
  }

  try {
    await User.create(userData);
    res.json({ message: "User added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

const getUser = (req, res) => {
  res.json({ message: "get user route" });
};

export { addUser, getUser };
