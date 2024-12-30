import { CONSTANTS } from "../constant/server.constants.js";
import WebSocket from "ws";

// ** WEBSOCKET **
const socket = new WebSocket(`wss://localhost:${CONSTANTS.PORT}`, {
  rejectUnauthorized: false, // Lukitse varmuudenvahvistuksen
});

// ** Yhteyden avaus **
socket.on("open", () => {
  console.log("WebSocket-yhteys avattu!");
  // Lähetä viesti palvelimelle
  socket.send("Hei palvelin!");
});

// Viestien vastaanotto
socket.on("message", (event) => {
  console.log("Palvelimelta saatu viesti:", event.toString());
});

// Yhteyden sulkeminen
socket.on("close", () => {
  console.log("Yhteys suljettu.");
});

// Virheiden käsittely
socket.on("error", (error) => {
  console.error("WebSocket-virhe:", error);
});
