// ** IMPORTS **
import dotenv from "dotenv";
import * as HTTPS from "https";
import * as FS from "fs";
import express from "express";
import helmet from "helmet";
import { WebSocketServer } from "ws";
import { CONSTANTS } from "./constant/constants.js";
import { verifyToken } from "./utils/jwt.js";
import AUTH_ROUTE from "./routes/auth.routes.js";
// ****** SERVER ******

dotenv.config();
const app = express();

// Middleware
app.use(
  express.json(),
  helmet(),
  helmet.hsts({ maxAge: 31536000, includeSubDomains: true })
);

// ** SERVER ROUTES FOR HTTPS PROTOCOL **
app.use("/api/auth", AUTH_ROUTE);

// ** CERTIFICATE **
const CERTIFICATIONS = {
  key: FS.readFileSync("./certs/cert.key"),
  cert: FS.readFileSync("./certs/cert.pem"),
};

// ** HTTPS SERVER **
const HTTPS_SERVER = HTTPS.createServer(CERTIFICATIONS, app);

// ****** WEBSOCKET SERVER ******
// noSever: Tells WebSocketServer not to create an HTTP server
// but to instead handle upgrade requests from the existing
// server (above).
const WSS = new WebSocketServer({ noServer: true });

// ** UPGRADE EVENT FOR WEBSOCKET **
HTTPS_SERVER.on("upgrade", async (req, socket, head) => {
  console.log("Upgrade-tapahtuma havaittu");

  const token = req.headers["sec-websocket-protocol"];
  if (!token) {
    console.log("Token puuttuu");
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  // Tarkista token JWT-tarkistuksella
  try {
    const user = await verifyToken(token);
    console.log(`Käyttäjä ${user.username} hyväksytty WebSocket-yhteyteen`);

    WSS.handleUpgrade(req, socket, head, (ws) => {
      ws.user = user;
      WSS.emit("connection", ws, req);
    });
  } catch (err) {
    console.log("Virheellinen token");
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
  }
});

// ** WEBSOCKET CONNECTION **
WSS.on("connection", (ws, req) => {
  console.log("Uusi WebSocket-yhteys avattu");

  // Lähetä tervetuloviesti asiakkaalle
  ws.send("Tervetuloa WebSocket-palvelimeen!");

  // Kuuntele asiakkaan lähettämiä viestejä
  ws.on("message", (message) => {
    console.log(`Vastaanotettu viesti: ${message}`);

    // Lähetä takaisin vahvistusviesti
    ws.send(`Viestisi: "${message}" vastaanotettu.`);
  });

  // Käsittele yhteyden katkeaminen
  ws.on("close", () => {
    console.log("Asiakas katkaisi yhteyden");
  });
});

// *** STARTING THE SERVER ***
HTTPS_SERVER.listen(CONSTANTS.PORT, () => {
  console.log(
    `\nHTTPS palvelin on käynnistetty onnistuneesti https://localhost:${CONSTANTS.PORT}`
  );
});
