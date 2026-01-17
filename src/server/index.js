require("dotenv").config();

const express = require("express");

// Import all routers
const peopleRouter = require("../app/people/people.controller");
const pizzasPlacesRouter = require("../app/pizzaPlaces/pizzasPlaces.controller");
const pizzasRouter = require("../app/pizzas/pizzas.controller");
const ordersRouter = require("../app/orders/orders.controller");
const cooksRouter = require("../app/cooks/cooks.controller");

// Main API router
const apiRouter = express.Router();

// Mount all routes with their prefixes
apiRouter.use("/people", peopleRouter);
apiRouter.use("/pizzaPlaces", pizzasPlacesRouter);
apiRouter.use("/pizzas", pizzasRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/cooks", cooksRouter);

// Global error handler
apiRouter.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = apiRouter;
