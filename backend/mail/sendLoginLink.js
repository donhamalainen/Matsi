import nodemailer from "nodemailer";
import { generateLoginLink } from "../utils/generate.js";

export const sendLoginLink = async (email) => {
  const generatedLink = await generateLoginLink(email);
  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Sähköpostiviestin tiedot
  const mailOptions = {
    from: `${process.env.EMAIL}`,
    to: email,
    subject: "Kirjautumislinkki sovellukseen",
    html: `
   <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
      <h2 style="font-size: 22px; color: #333;">Tervetuloa Boggo-sovellukseen!</h2>
      <p style="font-size: 16px; color: #555;">Klikkaa alla olevaa painiketta kirjautuaksesi sisään:</p>
      <a href="${generatedLink}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Kirjaudu sisään</a>
      <p style="font-size: 14px; color: #999;">Jos et pyytänyt kirjautumislinkkiä, jätä tämä sähköposti huomiotta.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eaeaea;">
      <p style="font-size: 12px; color: #bbb;">&copy; 2024 Boggo Oy. Kaikki oikeudet pidätetään.</p>
    </div>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Sähköposti lähetetty onnistuneesti: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(
      `Kirjautumislinkin lähettämisessä tapahtui virhe: ${error.message}`
    );
    return false;
  }
};
