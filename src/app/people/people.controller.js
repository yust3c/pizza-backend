const express = require("express");
const {
  registerUserHandler,
  authenticateUserHandler,
} = require("./people.service");

const peopleRouter = express.Router();

// POST /people/signup
peopleRouter.post("/signup", async (req, res) => {
  return registerUserHandler(req, res);
});

// POST /people/login
peopleRouter.post("/login", async (req, res) => {
  return authenticateUserHandler(req, res);
});

module.exports = peopleRouter;
