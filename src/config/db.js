const mongoose = require("mongoose");

// Puesto directo aquí, sin .env, para no tener que andar configurando nada al desplegar.
const MONGO_URI = "mongodb+srv://DvWilkerOFC:dvwilker15@dvwilker15.xndilqb.mongodb.net/wilker_api";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[Starline] MongoDB connected:", mongoose.connection.name);
    await cleanupLegacyIndexes();
  } catch (err) {
    console.error("[Starline] MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// La colección "users" de wilker_api viene de un proyecto anterior con un
// índice único en "username" que Starline no usa. Como nuestros documentos
// no traen ese campo, Mongo los guarda como username: null y el segundo
// usuario choca contra el índice (E11000 duplicate key). Lo tiramos solo.
async function cleanupLegacyIndexes() {
  try {
    const indexes = await mongoose.connection.collection("users").indexes();
    const legacy = indexes.find((i) => i.name === "username_1");
    if (legacy) {
      await mongoose.connection.collection("users").dropIndex("username_1");
      console.log("[Starline] Índice viejo 'username_1' eliminado de users");
    }
  } catch (err) {
    // Si la colección/índice no existe todavía no es un problema real.
    console.log("[Starline] Sin índices viejos que limpiar:", err.message);
  }
}

module.exports = connectDB;
module.exports.MONGO_URI = MONGO_URI;