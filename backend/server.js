// Dotenv konfiguraatio
require("dotenv").config();
const express = require("express");
const WebSocket = require("ws");

// Reititys
const authRoutes = require("./routes/auth.routes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.use(express.json());
// Reitit
app.use("/api/auth", authRoutes);

// Palvelin käynnistys
const server = app.listen(port, "0.0.0.0", () =>
  console.log(`Palvelin käynnistetty osoitteessa 0.0.0.0:${port}`)
);

const wss = new WebSocket.Server({ noServer: true });

// WebSocket-kättely HTTP-palvelimen kautta
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// WebSocket-logiikka
wss.on("connection", (ws) => {
  console.log("Uusi WebSocket-yhteys avattu.");

  // Lähetä tervehdysviesti
  ws.send("Tervetuloa WebSocket-palvelimeen!");

  // Käsittele viestit
  ws.on("message", (message) => {
    console.log("Vastaanotettu:", message.toString());

    // Lähetä viesti takaisin kaikille asiakkaille
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });

  // Yhteyden sulkeminen
  ws.on("close", () => {
    console.log("WebSocket-yhteys suljettu.");
  });
});
module.exports = {
  app,
  server,
};
