import pg from "pg";
import { CONSTANTS } from "../constant/constants.js";

// PostgreSQL:n tietokantayhteys
const pool = new pg.Pool({
  user: CONSTANTS.DB_USER,
  host: CONSTANTS.DB_HOST,
  database: CONSTANTS.DB_DATABASE,
  password: CONSTANTS.DB_PASSWORD,
  port: CONSTANTS.DB_PORT,
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
