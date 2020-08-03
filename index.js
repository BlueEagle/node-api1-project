const express = require("express");
const nanoid = require("nanoid").nanoid;

const server = express();

server.use(express.json()); // This is important to remember

let users = [
  {
    id: nanoid(),
    name: "John Doe",
    bio: "Not Tarzan.",
  },
  {
    id: nanoid(),
    name: "Jane Doe",
    bio: "Not Tarzan's wife.",
  },
  {
    id: nanoid(),
    name: "Mr Bean",
    bio: "Not vanilla bean.",
  },
];

server.post("/api/users", (req, res) => {
  const user = req.body;
  if (user.name === undefined || user.bio === undefined) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  try {
    user.id = nanoid();
    users.push(user);
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

server.get("/api/users", (req, res) => {
  try {
    res.send(users);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});

server.get("/api/users/:id", (req, res) => {
  try {
    let userFound = users.filter((user) => user.id === req.params.id);
    if (!userFound.name)
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    res.send(userFound);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  }
});

server.delete("/api/users/:id", (req, res) => {
  try {
    let userExists = false;
    users = users.filter((user) => {
      console.log(user.id);
      if (user.id === req.params.id) userExists = !userExists;
      return user.id !== req.params.id;
    });
    if (!userExists)
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  }
});

server.put("/api/users/:id", (req, res) => {
  try {
    if (req.body.name === undefined || req.body.bio === undefined) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    }
    let userFound = false;
    users = users.map((user) => {
      if (user.id === req.params.id) {
        userFound = true;
        user = req.body;
        user.id = nanoid();
        return user;
      }
      return user;
    });
    if (!userFound)
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." });
  }
});

const port = 8000;
server.listen(port, () => console.log(`Server running on port: ${port}...`));
