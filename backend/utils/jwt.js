import jwt from "jsonwebtoken";
import { CONSTANTS } from "../constant/constants.js";

// ** JWT CREATE TOKEN **
function createToken(user) {
  return jwt.sign(
    {
      email: user.email,
    },
    CONSTANTS.SECRET_TOKEN,
    { algorithm: "HS256", expiresIn: "365d" }
  );
}
// *** JWT CREATE TOKEN FOR LOGIN ***
function createEmailLoginToken(email) {
  return jwt.sign(
    {
      email,
    },
    CONSTANTS.SECRET_TOKEN,
    { algorithm: "HS256", expiresIn: "15m" }
  );
}
// ** JWT VERIFY **
function verifyToken(token) {
  try {
    return jwt.verify(token, CONSTANTS.SECRET_TOKEN);
  } catch (error) {
    console.error("Tokenin vahvistamisessa tapahtui virhe:", error.message);
    throw error;
  }
}

// ** JWT MIDDLEWARE **
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Pääsy evätty: tokeni puuttuu" });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Pääsy evätty: virheellinen tokeni" });
  }
}

export { verifyToken, createToken, createEmailLoginToken, authenticateToken };
