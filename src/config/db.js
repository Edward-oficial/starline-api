const mongoose = require("mongoose");

// Puesto directo aquí, sin .env, para no tener que andar configurando nada al desplegar.
const MONGO_URI = "mongodb+srv://DvWilkerOFC:dvwilker15@dvwilker15.xndilqb.mongodb.net/wilker_api";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[Starline] MongoDB connected:", mongoose.connection.name);
  } catch (err) {
    console.error("[Starline] MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
module.exports.MONGO_URI = MONGO_URI;