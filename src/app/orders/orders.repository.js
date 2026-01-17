const DBConnector = require("../../config/DBConnector");

async function insertOrderWithItems(orderData) {
  const connection = new DBConnector();

  const insertOrderSql =
    "INSERT INTO orders (order_number, customer_email, pizzaplace_id, total_price, status) VALUES (?, ?, ?, ?, ?)";
  await connection.performAsyncQuery(insertOrderSql, [
    orderData.order_number,
    orderData.customer_email,
    orderData.pizzaplace_id,
    orderData.total_price,
    orderData.status,
  ]);

  const getIdSql = "SELECT id FROM orders WHERE order_number = ?";
  const rows = await connection.performAsyncQuery(getIdSql, [
    orderData.order_number,
  ]);
  const orderId = rows[0].id;

  const insertItemSql =
    "INSERT INTO order_items (order_id, pizza_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)";

  for (const item of orderData.items) {
    await connection.performAsyncQuery(insertItemSql, [
      orderId,
      item.pizza_id,
      item.quantity,
      item.unit_price,
      item.subtotal,
    ]);
  }

  return orderId;
}

async function findOrdersByCustomer(email) {
  const connection = new DBConnector();
  const sql = "SELECT * FROM orders WHERE customer_email = ?";
  return connection.performAsyncQuery(sql, [email]);
}

async function findOrdersByPizzaPlace(pizzaplaceId) {
  const connection = new DBConnector();
  const sql =
    "SELECT * FROM orders WHERE pizzaplace_id = ? AND status IN ('pending','preparing')";
  return connection.performAsyncQuery(sql, [pizzaplaceId]);
}

async function findOrderById(id) {
  const connection = new DBConnector();
  const sql = "SELECT * FROM orders WHERE id = ?";
  return connection.performAsyncQuery(sql, [id]);
}

async function changeOrderStatus(orderId, status, cookEmail = null) {
  const connection = new DBConnector();

  const fields = ["status = ?"];
  const params = [status];

  if (cookEmail) {
    fields.push("cook_email = ?");
    params.push(cookEmail);
  }
  if (status === "delivered") {
    fields.push("delivery_date = NOW()");
  }

  const sql = `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`;
  params.push(orderId);

  return connection.performAsyncQuery(sql, params);
}

async function insertTransaction(tx) {
  const connection = new DBConnector();
  const sql =
    "INSERT INTO transactions (transaction_type, related_order_id, related_pizzaplace_id, user_email, amount) VALUES (?, ?, ?, ?, ?)";
  return connection.performAsyncQuery(sql, [
    tx.transaction_type,
    tx.related_order_id,
    tx.related_pizzaplace_id,
    tx.user_email,
    tx.amount,
  ]);
}

module.exports = {
  insertOrderWithItems,
  findOrdersByCustomer,
  findOrdersByPizzaPlace,
  findOrderById,
  changeOrderStatus,
  insertTransaction,
};
