function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ status: false, message: "No has iniciado sesión" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId || !req.session.isAdmin) {
    return res.status(403).json({ status: false, message: "Acceso solo para admin" });
  }
  next();
}

module.exports = { requireLogin, requireAdmin };