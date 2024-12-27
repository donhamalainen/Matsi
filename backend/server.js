// Dotenv konfiguraatio
require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/auth.routes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.use(express.json());
// Reitit
app.use("/api/auth", authRoutes);

// Palvelin käynnistys
const server = app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on 0.0.0.0:${port}`)
);

module.exports = {
  app,
  server,
};
