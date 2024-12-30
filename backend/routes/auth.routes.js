import express from "express";
import { sendLoginLink } from "../mail/sendLoginLink.js";

const router = express.Router();

// POST /api/auth/send-login
router.post("/send-login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Sähköposti puuttuu" });

  // Lähetä kirjautumislinkki sähköpostiin
  try {
    console.log(`Lähetetään kirjautumislinkki sähköpostiin: ${email}`);
    const result = await sendLoginLink(email);
    if (!result) {
      return res
        .status(400)
        .json({ error: "Tapahtui virhe sähköpostia lähettäessä" });
    }
    return res.status(200);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Sähköpostin lähettäminen epäonnistui" });
  }
});

export default router;
