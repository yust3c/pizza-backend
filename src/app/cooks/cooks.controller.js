const express = require("express");
const {
  createCookHandler,
  listCooksHandler,
  getCookByIdHandler,
  listCooksByPizzaPlaceHandler,
  removeCookHandler,
} = require("./cooks.service");

const cooksRouter = express.Router();

// POST /cooks/create
cooksRouter.post("/create", async (req, res) => {
  return createCookHandler(req, res);
});

// GET /cooks/
cooksRouter.get("/", async (req, res) => {
  return listCooksHandler(req, res);
});

// GET /cooks/:id
cooksRouter.get("/:id", async (req, res) => {
  return getCookByIdHandler(req, res);
});

// GET /cooks/pizzaplace/:pizzaplaceId
cooksRouter.get("/pizzaplace/:pizzaplaceId", async (req, res) => {
  return listCooksByPizzaPlaceHandler(req, res);
});

// DELETE /cooks/:id
cooksRouter.delete("/:id", async (req, res) => {
  return removeCookHandler(req, res);
});

module.exports = cooksRouter;
