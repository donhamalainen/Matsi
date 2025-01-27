// ** IMPORTS **
// import * as HTTPS from "https";
import * as HTTP from "http";
import * as FS from "fs";
import express from "express";
import helmet from "helmet";
import { WebSocketServer } from "ws";
import { CONSTANTS } from "./constant/constants.js";
import { verifyToken } from "./utils/jwt.js";
import AUTH_ROUTE from "./routes/auth.routes.js";
// ****** SERVER ******

const app = express();

// Middleware
app.use(express.json(), helmet());

// ** SERVER ROUTES FOR HTTPS PROTOCOL **
app.use("/api/auth", AUTH_ROUTE);
// ** CERTIFICATE **
// const CERTIFICATIONS = {
//   key: FS.readFileSync("./certs/cert.key", "utf8"),
//   cert: FS.readFileSync("./certs/cert.pem", "utf8"),
// };

// ** HTTPS SERVER **
// const HTTPS_SERVER = HTTPS.createServer(CERTIFICATIONS, app);
const HTTP_SERVER = HTTP.createServer(app);

// ****** WEBSOCKET SERVER ******
// noSever: Tells WebSocketServer not to create an HTTP server
// but to instead handle upgrade requests from the existing
// server (above).

// const WSS = new WebSocketServer({ noServer: true });
const WS = new WebSocketServer({ noServer: true });

// // ** UPGRADE EVENT FOR WEBSOCKET **
// HTTPS_SERVER.on("upgrade", async (req, socket, head) => {
HTTP_SERVER.on("upgrade", async (req, socket, head) => {
  console.log("Upgrade-tapahtuma havaittu");
  const token = req.headers["authorization"]?.split(" ")[1];

  // if (!token) {
  //   console.log("Token puuttuu");
  //   socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  //   socket.destroy();
  //   return;
  // }

  // Tarkista token JWT-tarkistuksella
  try {
    // const user = await verifyToken(token);
    // console.log(`Käyttäjä ${user.username} hyväksytty WebSocket-yhteyteen`);

    // WSS.handleUpgrade(req, socket, head, (ws) => {
    WS.handleUpgrade(req, socket, head, (ws) => {
      // ws.user = user;
      // WSS.emit("connection", ws, req);
      WS.emit("connection", ws, req);
    });
  } catch (err) {
    console.error(`Tokenin tarkistus epäonnistui: ${err.message}`);
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
  }
});

// // ** WEBSOCKET CONNECTION **
// WSS.on("connection", (ws, req) => {
WS.on("connection", (ws, req) => {
  console.log("Uusi WebSocket-yhteys avattu");
  console.log(req.headers);
  ws.send("Tervetuloa WebSocket-palvelimeen!");

  // Kuuntele asiakkaan lähettämiä viestejä
  ws.on("message", (message) => {
    console.log(`Viestisi: "${message}" lähetetty.`);
    ws.send(`Viestisi: "${message}" vastaanotettu.`);
  });

  ws.on("pong", (message) => {
    ws.send(`Viestisi: "${message}" vastaanotettu.`);
  });

  ws.on("error", (err) => {
    console.error(
      `Virhe WebSocket-yhteydessä käyttäjälle ${ws}: ${err.message}`
    );
  });

  ws.on("close", () => {
    console.log(`Käyttäjä  katkaisi yhteyden.`);
  });
});

// *** STARTING THE SERVER ***
HTTP_SERVER.listen(CONSTANTS.PORT, "0.0.0.0", () => {
  console.log(`\nPalvelin on käynnistetty http://localhost:${CONSTANTS.PORT}`);
});
