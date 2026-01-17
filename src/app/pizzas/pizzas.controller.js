const express = require("express");
const {
  addPizzaHandler,
  listPizzasHandler,
  removePizzaHandler,
} = require("./pizzas.service");

const pizzasRouter = express.Router();

// POST /pizzas/create
pizzasRouter.post("/create", async (req, res) => {
  return addPizzaHandler(req, res);
});

// GET /pizzas/
pizzasRouter.get("/", async (req, res) => {
  return listPizzasHandler(req, res);
});

// DELETE /pizzas/:id
pizzasRouter.delete("/:id", async (req, res) => {
  return removePizzaHandler(req, res);
});

module.exports = pizzasRouter;
