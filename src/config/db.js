const mongoose = require("mongoose");

// Puesto directo aquí, sin .env, para no tener que andar configurando nada al desplegar.
const MONGO_URI = "mongodb+srv://cololacalempira5_db_user:SbBgXc0nceVohHYm@edward-api.x26rpdm.mongodb.net/starline?appName=Edward-api";

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

// La colección "users" de esa base viene de proyectos anteriores tuyos con
// índices únicos (username, key, etc.) que Starline no usa. Como nuestros
// documentos no traen esos campos, Mongo los guarda como null y el segundo
// usuario choca contra el índice viejo (E11000 duplicate key). Se tiran
// todos los índices que no sean el _id_ de Mongo; Mongoose vuelve a crear
// los que sí necesitamos (email, apiKey) automáticamente al arrancar.
async function cleanupLegacyIndexes() {
  try {
    const indexes = await mongoose.connection.collection("users").indexes();
    for (const idx of indexes) {
      if (idx.name === "_id_") continue;
      await mongoose.connection.collection("users").dropIndex(idx.name);
      console.log(`[Starline] Índice viejo '${idx.name}' eliminado de users`);
    }
  } catch (err) {
    // Si la colección no existe todavía no es un problema real.
    console.log("[Starline] Sin índices viejos que limpiar:", err.message);
  }
}

module.exports = connectDB;
module.exports.MONGO_URI = MONGO_URI;