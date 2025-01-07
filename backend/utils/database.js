import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// PostgreSQL:n tietokantayhteys
const pool = new pg.Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

// Testaa tietokantayhteys kerran sovelluksen käynnistyessä
pool.connect((err, _, release) => {
  try {
    if (err) {
      throw err;
    }
    console.log("Tietokantayhteys onnistui.");
    release();
  } catch (err) {
    console.error("Virhe tietokantayhteyden testaamisessa:", err.message);
    process.exit(1);
  }
});

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};
