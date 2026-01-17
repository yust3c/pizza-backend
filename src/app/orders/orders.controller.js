const express = require("express");
const {
  createOrderHandler,
  getCustomerOrdersHandler,
  deliverOrderHandler,
} = require("./orders.service");

const ordersRouter = express.Router();

// POST /orders/create
ordersRouter.post("/create", async (req, res) => {
  return createOrderHandler(req, res);
});

// GET /orders/customer
ordersRouter.get("/customer", async (req, res) => {
  return getCustomerOrdersHandler(req, res);
});

// PUT /orders/:id/deliver
ordersRouter.put("/:id/deliver", async (req, res) => {
  return deliverOrderHandler(req, res);
});

module.exports = ordersRouter;
