const {
  insertOrderWithItems,
  findOrdersByCustomer,
  findOrderById,
  changeOrderStatus,
  insertTransaction,
} = require("./orders.repository");

const { getPizzaById } = require("../pizzas/pizzas.repository");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const key = process.env.JWT_SECRET || "SuperDuperSecretKey";

function getAuthToken(req) {
  const header = req.get("Authorization");
  if (!header) return null;
  const parts = header.split(" ");
  return parts.length === 2 ? parts[1] : null;
}

async function createOrderHandler(req, res) {
  const token = getAuthToken(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "customer") return res.sendStatus(403);

    if (!Array.isArray(req.body.items) || !req.body.pizzaplace_id) {
      return res.status(417).json({ error: "Missing items or pizzaplace_id" });
    }

    let totalPrice = 0;
    const itemsForDb = [];

    for (const item of req.body.items) {
      const pizzas = await getPizzaById(item.pizza_id);
      if (!pizzas || pizzas.length === 0) {
        return res.status(404).json({ error: "Pizza not found" });
      }

      const unitPrice = pizzas[0].price;
      const subtotal = unitPrice * item.quantity;
      totalPrice += subtotal;

      itemsForDb.push({
        pizza_id: item.pizza_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal,
      });
    }

    const orderNumber = `ORD-${Date.now()}-${uuid().slice(0, 8)}`;

    const orderData = {
      order_number: orderNumber,
      customer_email: payload.email,
      pizzaplace_id: req.body.pizzaplace_id,
      total_price: totalPrice,
      status: "pending",
      items: itemsForDb,
    };

    const orderId = await insertOrderWithItems(orderData);

    await insertTransaction({
      transaction_type: "order_placed",
      related_order_id: orderId,
      related_pizzaplace_id: req.body.pizzaplace_id,
      user_email: payload.email,
      amount: totalPrice,
    });

    return res
      .status(201)
      .json({ message: "Order created", order_number: orderNumber, total: totalPrice });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getCustomerOrdersHandler(req, res) {
  const token = getAuthToken(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "customer") return res.sendStatus(403);

    const orders = await findOrdersByCustomer(payload.email);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deliverOrderHandler(req, res) {
  const token = getAuthToken(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "cook") return res.sendStatus(403);

    const orders = await findOrderById(req.params.id);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];

    await changeOrderStatus(req.params.id, "delivered", payload.email);

    await insertTransaction({
      transaction_type: "order_delivered",
      related_order_id: req.params.id,
      related_pizzaplace_id: order.pizzaplace_id,
      user_email: payload.email,
      amount: order.total_price,
    });

    return res.json({ message: "Order marked as delivered" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createOrderHandler,
  getCustomerOrdersHandler,
  deliverOrderHandler,
};
