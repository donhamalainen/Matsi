import * as pg from "pg";

// PostgreSQL:n tietokantayhteys
const pool = new pg.Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Tietokantayhteys epäonnistui:", err);
  } else {
    console.log("Tietokantayhteys onnistui:", res.rows[0]);
  }
});

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};
