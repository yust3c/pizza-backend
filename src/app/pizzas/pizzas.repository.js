const DBConnector = require("../../config/DBConnector");

async function storePizza({ name, price, category }) {
  const connection = new DBConnector();
  const sql =
    "INSERT INTO pizzas (name, price, category) VALUES (?, ?, ?)";
  return connection.performAsyncQuery(sql, [name, price, category]);
}

async function retrieveAllPizzas() {
  const connection = new DBConnector();
  const sql = "SELECT * FROM pizzas";
  return connection.performAsyncQuery(sql);
}

async function retrievePizzaById(id) {
  const connection = new DBConnector();
  const sql = "SELECT * FROM pizzas WHERE id = ?";
  return connection.performAsyncQuery(sql, [id]);
}

async function deletePizza(id) {
  const connection = new DBConnector();
  const sql = "DELETE FROM pizzas WHERE id = ?";
  return connection.performAsyncQuery(sql, [id]);
}

module.exports = {
  storePizza,
  retrieveAllPizzas,
  retrievePizzaById,
  deletePizza,
};
