import dotenv from "dotenv";

dotenv.config();
export const CONSTANTS = {
  // DEFAULT SETTINGS
  PORT: process.env.PORT || 5001,
  ENVIRONMENT: process.env.ENVIRONMENT || "home",
  SECRET_TOKEN: process.env.SECRET_TOKEN,
  // DB configuration
  DB_USER: process.env.DB_USER || "postgres",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_DATABASE: process.env.DB_DATABASE || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_PORT: process.env.DB_PORT || 5432,
};
