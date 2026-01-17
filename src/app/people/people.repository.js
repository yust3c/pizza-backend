const DBConnector = require("../../config/DBConnector");

async function addUser({ email, password, name, lastname, role }) {
  const connection = new DBConnector();
  const sql =
    "INSERT INTO people (email, password, name, lastname, role) VALUES (?, ?, ?, ?, ?)";
  return connection.performAsyncQuery(sql, [
    email,
    password,
    name,
    lastname,
    role,
  ]);
}

async function findUserByEmail(email) {
  const connection = new DBConnector();
  const sql = "SELECT * FROM people WHERE email = ?";
  return connection.performAsyncQuery(sql, [email]);
}

module.exports = { addUser, findUserByEmail };
