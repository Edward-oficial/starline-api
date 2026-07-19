const { findUserByEmail, createUser } = require("../models/User");
const { generateApiKey } = require("./apiKey");

const ADMIN_EMAIL = "cololacalempira5@gmail.com";
const ADMIN_PASSWORD = "Edward";

async function seedAdmin() {
  const existing = await findUserByEmail(ADMIN_EMAIL);
  if (existing) return;

  await createUser({
    name: "Edward",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    apiKey: generateApiKey("admin"),
    isAdmin: true,
    isUnlimited: true,
    weeklyLimit: 0
  });

  console.log("[Starline] Cuenta admin por defecto creada:", ADMIN_EMAIL);
}

module.exports = seedAdmin;