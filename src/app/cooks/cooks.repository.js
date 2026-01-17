const DBConnector = require("../../config/DBConnector");

async function insertCook({ cook_email, pizzaplace_id }) {
  const connection = new DBConnector();
  const query =
    "INSERT INTO cooks (cook_email, pizzaplace_id) VALUES (?, ?)";
  return connection.performAsyncQuery(query, [cook_email, pizzaplace_id]);
}

async function fetchAllCooks() {
  const connection = new DBConnector();
  const query = "SELECT * FROM cooks";
  return connection.performAsyncQuery(query);
}

async function fetchCookById(id) {
  const connection = new DBConnector();
  const query = "SELECT * FROM cooks WHERE id = ?";
  return connection.performAsyncQuery(query, [id]);
}

async function fetchCooksByPizzaPlace(pizzaplaceId) {
  const connection = new DBConnector();
  const query = "SELECT * FROM cooks WHERE pizzaplace_id = ?";
  return connection.performAsyncQuery(query, [pizzaplaceId]);
}

async function removeCook(id) {
  const connection = new DBConnector();
  const query = "DELETE FROM cooks WHERE id = ?";
  return connection.performAsyncQuery(query, [id]);
}

async function fetchCookAssignmentByEmail(cookEmail) {
  const connection = new DBConnector();
  const query = "SELECT * FROM cooks WHERE cook_email = ?";
  return connection.performAsyncQuery(query, [cookEmail]);
}

module.exports = {
  insertCook,
  fetchAllCooks,
  fetchCookById,
  fetchCooksByPizzaPlace,
  removeCook,
  fetchCookAssignmentByEmail,
};
