const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/session");
const { updateUser } = require("../models/User");

// POST /profile/picture  { image: "data:image/png;base64,..." }
router.post("/picture", requireLogin, async (req, res) => {
  const { image } = req.body;

  if (!image || !image.startsWith("data:image/")) {
    return res.status(400).json({ status: false, message: "Imagen inválida" });
  }

  // Límite simple para no llenar la base de datos con imágenes gigantes
  if (image.length > 2_000_000) {
    return res.status(400).json({ status: false, message: "La imagen es muy pesada (máx ~1.5MB)" });
  }

  await updateUser(req.session.userId, { profilePicture: image });

  res.json({ status: true, message: "Foto de perfil actualizada" });
});

module.exports = router;