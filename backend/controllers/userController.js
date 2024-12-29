import User from "../models/player.model.js";

const addUser = async (req, res) => {
  const userDetails = req.body;

  if (!userDetails || !userDetails.name) {
    res.status(400).json("Invalid data");
  }

  try {
    await User.create(userDetails);

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

const getUser = (req, res) => {
  res.json({ message: "get user route" });
};

export { addUser, getUser };
