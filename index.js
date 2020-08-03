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
    res
      .status(500)
      .json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
  }
});

server.get("/api/users", (req, res) => {
  res.send(users);
});

server.get("/api/users/:id", (req, res) => {
  res.send(users.filter((user) => user.id === req.params.id));
});

server.delete("/api/users/:id", (req, res) => {
  users = users.filter((user) => user.id !== req.params.id);
  res.status(200).end();
});

server.put("/api/users/:id", (req, res) => {
  users = users.map((user) => {
    if (user.id === req.params.id) {
      user = req.body;
      user.id = nanoid();
      return user;
    }
    return user;
  });
  res.status(200).json(users);
});

const port = 8000;
server.listen(port, () => console.log(`Server running on port: ${port}...`));
