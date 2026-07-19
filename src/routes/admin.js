const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/session");
const { getAllUsers, updateUser, deleteUser } = require("../models/User");

router.use(requireAdmin);

// GET /admin/users -> lista completa, incluyendo email y password en texto plano
router.get("/users", async (req, res) => {
  const users = await getAllUsers();
  res.json({ status: true, count: users.length, users });
});

// PATCH /admin/users/:id  { weeklyLimit, requestsThisWeek, isUnlimited, isActive, name }
router.patch("/users/:id", async (req, res) => {
  const allowed = ["weeklyLimit", "requestsThisWeek", "isUnlimited", "isActive", "name"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const user = await updateUser(req.params.id, updates);
  if (!user) return res.status(404).json({ status: false, message: "No encontrado" });
  res.json({ status: true, user });
});

// POST /admin/users/:id/add  { amount }  -> suma solicitudes disponibles (resta del contador usado)
router.post("/users/:id/add", async (req, res) => {
  const amount = Number(req.body.amount) || 0;
  const { findUserById } = require("../models/User");
  const user = await findUserById(req.params.id);
  if (!user) return res.status(404).json({ status: false, message: "No encontrado" });

  user.requestsThisWeek = Math.max(0, user.requestsThisWeek - amount);
  await user.save();
  res.json({ status: true, user });
});

// DELETE /admin/users/:id
router.delete("/users/:id", async (req, res) => {
  const user = await deleteUser(req.params.id);
  if (!user) return res.status(404).json({ status: false, message: "No encontrado" });
  res.json({ status: true, message: "Eliminado" });
});

module.exports = router;