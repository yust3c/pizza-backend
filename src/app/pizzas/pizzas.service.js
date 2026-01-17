const {
  storePizza,
  retrieveAllPizzas,
  deletePizza,
} = require("./pizzas.repository");

const jwt = require("jsonwebtoken");

const key = process.env.JWT_SECRET || "SuperDuperSecretKey";

function extractAuth(req) {
  const header = req.get("Authorization");
  if (!header) return null;
  const parts = header.split(" ");
  return parts.length === 2 ? parts[1] : null;
}

function checkPizzaFields(body) {
  return body && body.name && body.price && body.category;
}

async function addPizzaHandler(req, res) {
  const token = extractAuth(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "manager") return res.sendStatus(403);

    if (!checkPizzaFields(req.body)) {
      return res.sendStatus(417);
    }

    const pizzaData = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    await storePizza(pizzaData);
    return res
      .status(201)
      .json({ message: "Pizza menu item created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function listPizzasHandler(req, res) {
  const token = extractAuth(req);
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, key);
    const pizzas = await retrieveAllPizzas();
    return res.json(pizzas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function removePizzaHandler(req, res) {
  const token = extractAuth(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "manager") return res.sendStatus(403);

    if (!req.params.id) return res.sendStatus(417);

    await deletePizza(req.params.id);
    return res.json({ message: "Pizza menu item deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  addPizzaHandler,
  listPizzasHandler,
  removePizzaHandler,
};
