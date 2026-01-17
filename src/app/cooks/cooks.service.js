const {
  insertCook,
  fetchAllCooks,
  fetchCookById,
  fetchCooksByPizzaPlace,
  removeCook,
} = require("./cooks.repository");

const jwt = require("jsonwebtoken");

const key = process.env.JWT_SECRET || "SuperDuperSecretKey";

function extractToken(req) {
  const header = req.get("Authorization");
  if (!header) return null;
  const parts = header.split(" ");
  return parts.length === 2 ? parts[1] : null;
}

async function createCookHandler(req, res) {
  const token = extractToken(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "manager") return res.sendStatus(403);

    const { cook_email, pizzaplace_id } = req.body || {};
    if (!cook_email || !pizzaplace_id) {
      return res.status(417).json({ error: "cook_email and pizzaplace_id are required" });
    }

    await insertCook({ cook_email, pizzaplace_id });
    return res.status(201).json({ message: "Cook assigned", cook_email, pizzaplace_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function listCooksHandler(req, res) {
  const token = extractToken(req);
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, key);
    const cooks = await fetchAllCooks();
    return res.json(cooks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getCookByIdHandler(req, res) {
  const token = extractToken(req);
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, key);
    const cooks = await fetchCookById(req.params.id);
    if (!cooks || cooks.length === 0) {
      return res.status(404).json({ error: "Cook not found" });
    }
    return res.json(cooks[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function listCooksByPizzaPlaceHandler(req, res) {
  const token = extractToken(req);
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, key);
    const cooks = await fetchCooksByPizzaPlace(req.params.pizzaplaceId);
    return res.json(cooks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function removeCookHandler(req, res) {
  const token = extractToken(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "manager") return res.sendStatus(403);

    await removeCook(req.params.id);
    return res.json({ message: "Cook deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createCookHandler,
  listCooksHandler,
  getCookByIdHandler,
  listCooksByPizzaPlaceHandler,
  removeCookHandler,
};
