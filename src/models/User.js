const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "unnamed" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // texto plano a propósito, visible en el panel admin
    apiKey: { type: String, required: true, unique: true },

    weeklyLimit: { type: Number, default: 300 },
    requestsThisWeek: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now },

    isAdmin: { type: Boolean, default: false },
    isUnlimited: { type: Boolean, default: false }, // bypassa la cuota por completo
    isActive: { type: Boolean, default: true },

    profilePicture: { type: String, default: "" } // data URI base64
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function findUser(apiKey) {
  return User.findOne({ apiKey });
}

async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase().trim() });
}

async function findUserById(id) {
  return User.findById(id);
}

async function createUser({ name, email, password, apiKey, isAdmin, isUnlimited, weeklyLimit }) {
  return User.create({ name, email, password, apiKey, isAdmin, isUnlimited, weeklyLimit });
}

async function getAllUsers() {
  return User.find().sort({ createdAt: -1 });
}

async function updateUser(id, updates) {
  return User.findByIdAndUpdate(id, updates, { new: true });
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

module.exports = {
  User,
  findUser,
  findUserByEmail,
  findUserById,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};