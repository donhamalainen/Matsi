import express from "express";
import { verifyToken } from "../utils/jwt.js";
import { sendLoginLink } from "../mail/sendLoginLink.js";
import { verifyEmailHash } from "../utils/generate.js";

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
// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { token, email_hash, valid_until } = req.body;

  if (!token || !email_hash || !valid_until) {
    return res
      .status(400)
      .json({ error: "Kirjautuminen epäonnistui: puuttuvia parametreja" });
  }

  try {
    // Vahvista JWT-token
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.email) {
      throw new Error("Tokenin dekoodaus epäonnistui");
    }

    // Tarkista hajautettu sähköposti
    const isEmailValid = await verifyEmailHash(decoded.email, email_hash);
    if (!isEmailValid) {
      return res.status(400).json({
        error: "Kirjautuminen epäonnistui: sähköpostihajautus ei täsmää",
      });
    }

    // Tarkista linkin vanhenemisaika
    if (new Date(valid_until) < new Date()) {
      return res.status(400).json({
        error:
          "Kirjautumislinkki on vanhentunut. Pyydä uusi linkki kirjautumista varten.",
      });
    }

    // Kirjautuminen onnistui, palautetaan käyttäjän tunnus
    return res
      .status(200)
      .json({ message: "Kirjautuminen onnistui", email: decoded.email });
  } catch (err) {
    console.error("Kirjautumisvirhe:", err.message || err);
    return res
      .status(403)
      .json({ error: "Virheellinen tai vanhentunut token" });
  }
});

export default router;
