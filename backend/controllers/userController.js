const addUser = (req, res) => {
  res.json({ message: "add user route" });
};

const getUser = (req, res) => {
  res.json({ message: "get user route" });
};

export { addUser, getUser };
