const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./src/config/db");
const { MONGO_URI } = require("./src/config/db");
const seedAdmin = require("./src/utils/seedAdmin");

const apiRoutes = require("./src/routes/index");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const adminRoutes = require("./src/routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

app.use(
  session({
    secret: "starline-secret-session-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 días
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);

app.get("/api/status", (req, res) => {
  res.json({
    status: true,
    name: "Starline API",
    creator: "API by Edward",
    uptime: process.uptime()
  });
});

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`[Starline] Corriendo en el puerto ${PORT}`);
  });
});