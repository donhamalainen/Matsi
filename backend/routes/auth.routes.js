import express from "express";
import { verifyToken, createToken } from "../utils/jwt.js";
import { sendLoginLink } from "../mail/sendLoginLink.js";
import { verifyEmailHash } from "../utils/generate.js";
import pool from "../utils/database.js";

const router = express.Router();

// POST /api/auth/send-login
router.post("/send-login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Sähköposti puuttuu" });

  // Lähetä kirjautumislinkki sähköpostiin
  try {
    console.log(`Lähetetään kirjautumislinkki sähköpostiin: ${email}`);
    const result = await sendLoginLink(email);
    if (result) {
      return res
        .status(200)
        .json({ message: "Kirjautumislinkki lähetetty onnistuneesti" });
    }
    return res
      .status(400)
      .json({ error: "Tapahtui virhe sähköpostia lähettäessä" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Sähköpostin lähettäminen epäonnistui" });
  }
});

// POST /email-login
router.post("/email-login", async (req, res) => {
  const { email, email_hash, token, valid_until } = req.body;
  // Tarkista, että kaikki parametrit ovat mukana
  if (!email || !email_hash || !token || !valid_until) {
    return res
      .status(400)
      .json({ error: "Kirjautuminen evätty: sinulta puuttuu parametreja" });
  }

  try {
    const decoded = await verifyToken(token);
    const email = decoded.email;

    const isEmailValid = await verifyEmailHash(email, email_hash);
    if (!isEmailValid) {
      return res.status(400).json({
        error: "Virheellinen sähköpostihajautus.",
      });
    }

    if (new Date(valid_until) < new Date()) {
      return res.status(400).json({
        error: "Linkki on vanhentunut.",
      });
    }

    // Luo autentikaatio-token
    const authToken = await createToken({ email });
    console.log(authToken);

    // Tallennetaan tiedot tietokantaan tai jos ne on siellä niin päivitetään
    try {
      const db_user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (db_user.rows.length > 0) {
        // Käyttäjä löytyi, päivitetään vain last_login
        await pool.query(
          "UPDATE users SET last_login = NOW() WHERE email = $1",
          [email]
        );
        console.log("Käyttäjän kirjautumisaika päivitetty.");
      } else {
        // Käyttäjää ei löytynyt, lisätään uusi
        await pool.query("INSERT INTO users (email) VALUES ($1)", [email]);
        console.log("Uusi käyttäjä lisätty tietokantaan.");
      }
    } catch (dbError) {
      console.error("Tietokantavirhe:", dbError.message);
      return res.status(500).json({
        error: "Tietokantavirhe. Kirjautumista ei voitu suorittaa.",
      });
    }

    // Palauta autentikaatio-token
    return res.status(200).json({
      message: "Kirjautuminen onnistui.",
      authToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token on vanhentunut. Pyydä uusi kirjautumislinkki.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        error: "Virheellinen token. Varmista, että linkki on oikein.",
      });
    }

    return res
      .status(500)
      .json({ error: "Järjestelmävirhe. Yritä myöhemmin uudelleen." });
  }
});

export default router;
