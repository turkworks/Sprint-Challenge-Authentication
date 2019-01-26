const axios = require("axios");

const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const server = express();
knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

server.use(cors());
server.use(express.json());
server.use(helmet());

const { authenticate, generateToken } = require("./middlewares");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
  server.post("/api/post-jokes", authenticate, postJokes);
};

function register(req, res) {
  const userInfo = req.body;
  const hash = bcrypt.hashSync(userInfo.password, 14);
  userInfo.password = hash;

  db("users")
    .insert(userInfo)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err =>
      res.status(500).json({ message: "register went wrong, bro" })
    );
}

function login(req, res) {
  const cred = req.body;

  db("users")
    .where({ username: cred.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(cred.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `welcome ${user.username}`, token });
      } else {
        res.status(401).json({ you: "shall not pass, human!" });
      }
    })
    .catch(err => res.status(500).json({ message: "login failed" }));
}

function postJokes(req, res) {
  db("jokes")
    .insert(req.body)
    .then(joke => {
      res.status(201).json(joke);
    })
    .catch(err => res.status(500).json(err));
}

async function getJokes(req, res) {
  const jokes = await db("jokes").select("id", "joke", "punchline");
  res.status(200).json(jokes);
}
