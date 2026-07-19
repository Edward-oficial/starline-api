const express = require("express");
const router = express.Router();
const apiKeyAuth = require("../middleware/auth");
const youtubeRoutes = require("./youtube");

// Rutas de la API real, protegidas por x-api-key + cuota semanal.
// Agrega nuevos grupos de endpoints aquí, ej:
// const tiktokRoutes = require("./tiktok");
// router.use("/tiktok", apiKeyAuth, tiktokRoutes);

router.use("/youtube", apiKeyAuth, youtubeRoutes);

module.exports = router;