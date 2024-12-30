import nodemailer from "nodemailer";

export const sendLoginLink = async (email) => {
  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">
      <h1 style="font-size: 24px; text-align: center; color: #4CAF50; margin-bottom: 20px;">Shelkeesti tarvitset tätä!</h1>
      <p style="font-size: 16px; color: #333; text-align: center;">Vahvistuskoodisi on:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; color: #4CAF50;">${12345}</span>
      </div>
      <p style="font-size: 16px; color: #333; text-align: center;">Tämä koodi vanhenee <strong>60 sekunnin</strong> kuluttua. Ethän jaa tätä koodia kenellekkään.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eaeaea;">
      <p style="font-size: 12px; color: #999; text-align: center;">Jos et ole pyytänyt tätä koodia, jätä tämä sähköposti huomiotta tai ota yhteyttä asiakaspalveluun.</p>
      <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2024 Boggo Oy.</p>
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
