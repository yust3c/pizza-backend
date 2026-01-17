const { addUser, findUserByEmail } = require("./people.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const key = process.env.JWT_SECRET || "SuperDuperSecretKey";

function validateSignupBody(body) {
  return (
    body &&
    body.email &&
    body.password &&
    body.name &&
    body.lastname &&
    body.role
  );
}

function validateLoginBody(body) {
  return body && body.email && body.password;
}

async function registerUserHandler(req, res) {
  if (!validateSignupBody(req.body)) {
    return res.sendStatus(417);
  }

  try {
    const { email, password, name, lastname, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await addUser({
      email,
      password: hashedPassword,
      name,
      lastname,
      role,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function authenticateUserHandler(req, res) {
  if (!validateLoginBody(req.body)) {
    return res.sendStatus(417);
  }

  try {
    const { email, password } = req.body;
    const users = await findUserByEmail(email);

    if (!users || users.length === 0) {
      return res.sendStatus(404);
    }

    const isValid = await bcrypt.compare(password, users[0].password);

    if (isValid) {
      const token = jwt.sign(
        { email: users[0].email, role: users[0].role },
        key
      );
      return res.json({ token });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  registerUserHandler,
  authenticateUserHandler,
};
