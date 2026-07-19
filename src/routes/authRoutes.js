const express = require("express");
const router = express.Router();
const { findUserByEmail, createUser } = require("../models/User");
const { generateApiKey } = require("../utils/apiKey");
const { requireLogin } = require("../middleware/session");

// POST /auth/register  { name, email, password }
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: false, message: "Faltan campos (name, email, password)" });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ status: false, message: "Ese correo ya está registrado" });
  }

  const user = await createUser({
    name,
    email,
    password,
    apiKey: generateApiKey()
  });

  req.session.userId = user._id.toString();
  req.session.isAdmin = false;

  res.json({
    status: true,
    message: "Cuenta creada",
    user: { id: user._id, name: user.name, email: user.email, apiKey: user.apiKey }
  });
});

// POST /auth/login  { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: false, message: "Faltan campos (email, password)" });
  }

  const user = await findUserByEmail(email);
  if (!user || user.password !== password || !user.isActive) {
    return res.status(401).json({ status: false, message: "Correo o contraseña incorrectos" });
  }

  req.session.userId = user._id.toString();
  req.session.isAdmin = user.isAdmin;

  res.json({
    status: true,
    message: "Sesión iniciada",
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
  });
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ status: true, message: "Sesión cerrada" });
  });
});

// GET /auth/me
router.get("/me", requireLogin, async (req, res) => {
  const { findUserById } = require("../models/User");
  const user = await findUserById(req.session.userId);

  if (!user) {
    return res.status(404).json({ status: false, message: "Usuario no encontrado" });
  }

  res.json({
    status: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      apiKey: user.apiKey,
      isAdmin: user.isAdmin,
      isUnlimited: user.isUnlimited,
      weeklyLimit: user.weeklyLimit,
      requestsThisWeek: user.requestsThisWeek,
      profilePicture: user.profilePicture
    }
  });
});

module.exports = router;