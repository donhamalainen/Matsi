import express from "express";
import { verifyToken, createToken } from "../utils/jwt.js";
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
    console.log(email, email_hash, token, valid_until);
    const decoded = await verifyToken(token);
    console.log(decoded);

    // const isEmailValid = await verifyEmailHash(email, email_hash);
    // console.log(isEmailValid);
    // if (!isEmailValid) {
    //   return res.status(400).json({
    //     error: "Virheellinen sähköpostihajautus.",
    //   });
    // }

    // if (new Date(valid_until) < new Date()) {
    //   return res.status(400).json({
    //     error: "Linkki on vanhentunut.",
    //   });
    // }

    // Luo autentikaatio-token
    // const authToken = await createToken({ email });

    // Palauta autentikaatio-token
    return res.status(200).json({
      message: "Kirjautuminen onnistui.",
      // authToken,
    });
  } catch (error) {
    console.error("Virhe tokenin vahvistamisessa:", error);
    return res
      .status(403)
      .json({ error: "Virheellinen tai vanhentunut token." });
  }
});

export default router;
