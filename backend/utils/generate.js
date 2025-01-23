import bcrypt from "bcrypt";
import { createEmailLoginToken } from "./jwt.js";
import { CONSTANTS } from "../constant/constants.js";

const UNIVERSAL_URL =
  (CONSTANTS.ENVIRONMENT === "home" && "http://192.168.76.182:3000") ||
  (CONSTANTS.ENVIRONMENT === "phone" && "http://172.20.10.3:3000");

const APP_SCHEME =
  (CONSTANTS.ENVIRONMENT === "home" && "exp://192.168.76.182:8081") ||
  (CONSTANTS.ENVIRONMENT === "phone" && "exp://172.20.10.3:8081");

// *** COMPARE BCRYPT TOOLS ***
const compareEmail = async (email, hashedEmail) => {
  return await bcrypt.compare(email, hashedEmail);
};
// *** EMAIL HASH ***
const emailHash = async (email, saltRounds = 10) => {
  return await bcrypt.hash(email, saltRounds);
};
// *** EMAIL VERIFY ***
const verifyEmailHash = async (email, hash) => {
  return await bcrypt.compare(email, hash);
};
// *** GENERATE LINK ***
const generateLoginLink = async (email) => {
  try {
    const emailHashed = await emailHash(email);
    const token = await createEmailLoginToken(email);
    const validUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const deepLink = `${APP_SCHEME}/--/login/verify?email=${encodeURIComponent(
      email
    )}&email_hash=${encodeURIComponent(emailHashed)}&token=${encodeURIComponent(
      token
    )}&valid_until=${encodeURIComponent(validUntil)}`;

    const universalLink = `${UNIVERSAL_URL}/email-login?login_link=${encodeURIComponent(
      deepLink
    )}&universal=true`;

    return universalLink;
  } catch (e) {
    console.error("Linkin luonti epäonnistui:", e.message || e);
    throw e;
  }
};

export { verifyEmailHash, generateLoginLink, compareEmail };
