const DBConnector = require("../../config/DBConnector");

async function savePizzaPlace({ name, address, city, phone, manager_email }) {
  const connection = new DBConnector();
  const sql =
    "INSERT INTO pizzaPlaces (name, address, city, phone, manager_email) VALUES (?, ?, ?, ?, ?)";
  return connection.performAsyncQuery(sql, [
    name,
    address,
    city,
    phone,
    manager_email,
  ]);
}

async function loadAllPizzaPlaces() {
  const connection = new DBConnector();
  const sql = "SELECT * FROM pizzaPlaces";
  return connection.performAsyncQuery(sql);
}

async function loadPizzaPlaceById(id) {
  const connection = new DBConnector();
  const sql = "SELECT * FROM pizzaPlaces WHERE id = ?";
  return connection.performAsyncQuery(sql, [id]);
}

async function removePizzaPlace(id) {
  const connection = new DBConnector();
  const sql = "DELETE FROM pizzaPlaces WHERE id = ?";
  return connection.performAsyncQuery(sql, [id]);
}

module.exports = {
  savePizzaPlace,
  loadAllPizzaPlaces,
  loadPizzaPlaceById,
  removePizzaPlace,
};
