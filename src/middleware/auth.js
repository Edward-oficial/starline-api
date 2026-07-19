const { findUser } = require("../models/User");

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Middleware para proteger endpoints de /api/* con x-api-key + cuota semanal
async function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.apikey;

  if (!apiKey) {
    return res.status(401).json({ status: false, message: "Falta la API key (header x-api-key)" });
  }

  const user = await findUser(apiKey);

  if (!user || !user.isActive) {
    return res.status(403).json({ status: false, message: "API key inválida o inactiva" });
  }

  if (user.isUnlimited) {
    req.apiUser = user;
    return next();
  }

  const now = Date.now();
  if (now - new Date(user.lastReset).getTime() >= WEEK_MS) {
    user.requestsThisWeek = 0;
    user.lastReset = new Date();
  }

  if (user.requestsThisWeek >= user.weeklyLimit) {
    return res.status(429).json({
      status: false,
      message: `Límite semanal alcanzado (${user.weeklyLimit} solicitudes). Se reinicia en 7 días desde tu último reinicio.`
    });
  }

  user.requestsThisWeek += 1;
  await user.save();

  req.apiUser = user;
  next();
}

module.exports = apiKeyAuth;