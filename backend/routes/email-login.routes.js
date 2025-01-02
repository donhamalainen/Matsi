import express from "express";
import { createToken, verifyToken } from "../utils/jwt.js";
import { compareEmail } from "../utils/generate.js";
const router = express.Router();

// POST /email-login
router.post("/email-login", async (req, res) => {
  const { token, email_hash, valid_until } = req.body;
  // Tarkista, että kaikki parametrit ovat mukana
  if (!token || !email_hash || !valid_until) {
    return res
      .status(400)
      .json({ error: "Kirjautuminen evätty: sinulta puuttuu parametreja" });
  }

  try {
    const decoded = await verifyToken(token);
    const email = decoded.email;

    const isEmailValid = await compareEmail(email, email_hash);
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

    // Palauta autentikaatio-token
    return res.status(200).json({
      message: "Kirjautuminen onnistui.",
      authToken,
    });
  } catch (error) {
    console.error("Virhe tokenin vahvistamisessa:", err);
    return res
      .status(403)
      .json({ error: "Virheellinen tai vanhentunut token." });
  }
});

export default router;
