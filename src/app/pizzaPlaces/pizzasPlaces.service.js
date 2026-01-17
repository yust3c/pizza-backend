const {
  savePizzaPlace,
  loadAllPizzaPlaces,
  removePizzaPlace,
} = require("./pizzasPlaces.repository");

const jwt = require("jsonwebtoken");

const key = process.env.JWT_SECRET || "SuperDuperSecretKey";

function getBearerToken(req) {
  const header = req.get("Authorization");
  if (!header) return null;
  const parts = header.split(" ");
  return parts.length === 2 ? parts[1] : null;
}

function hasRequiredFields(body) {
  return (
    body &&
    body.name &&
    body.address &&
    body.city &&
    body.manager_email
  );
}

async function createPizzaPlaceHandler(req, res) {
  const token = getBearerToken(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "manager") return res.sendStatus(403);

    if (!hasRequiredFields(req.body)) {
      return res.sendStatus(417);
    }

    const pizzaPlaceData = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone || null,
      manager_email: req.body.manager_email,
    };

    await savePizzaPlace(pizzaPlaceData);
    return res.status(201).json({ message: "Pizza place created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function listPizzaPlacesHandler(req, res) {
  const token = getBearerToken(req);
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, key);
    const places = await loadAllPizzaPlaces();
    return res.json(places);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deletePizzaPlaceHandler(req, res) {
  const token = getBearerToken(req);
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, key);
    if (payload.role !== "manager") return res.sendStatus(403);

    if (!req.params.id) return res.sendStatus(417);

    await removePizzaPlace(req.params.id);
    return res.json({ message: "Pizza place deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createPizzaPlaceHandler,
  listPizzaPlacesHandler,
  deletePizzaPlaceHandler,
};
