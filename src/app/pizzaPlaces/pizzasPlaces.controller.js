const express = require("express");
const {
  createPizzaPlaceHandler,
  listPizzaPlacesHandler,
  deletePizzaPlaceHandler,
} = require("./pizzasPlaces.service");

const pizzasPlacesRouter = express.Router();

// POST /pizzasPlaces/create
pizzasPlacesRouter.post("/create", async (req, res) => {
  return createPizzaPlaceHandler(req, res);
});

// GET /pizzasPlaces/
pizzasPlacesRouter.get("/", async (req, res) => {
  return listPizzaPlacesHandler(req, res);
});

// DELETE /pizzasPlaces/:id
pizzasPlacesRouter.delete("/:id", async (req, res) => {
  return deletePizzaPlaceHandler(req, res);
});

module.exports = pizzasPlacesRouter;
