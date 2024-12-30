import jwt from "jsonwebtoken";

const SECRET_TOKEN = process.env.SECRET_TOKEN;

// ** JWT CREATE TOKEN **
function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "365d" }
  );
}

// ** JWT VERIFY **
function verifyToken(token) {
  return jwt.verify(token, SECRET_TOKEN);
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

export { verifyToken, createToken, authenticateToken };
