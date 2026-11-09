// env.ts
// Reads the settings from the .env file in one place,so the rest of the code uses `env.port`, `env.mongoUrl`,e.t.c.

import dotenv from "dotenv";

dotenv.config({ quiet: true });

// === Step 1: Read the settings from .env
// All settings (port, database address, JWT secret....) are read from .env here, once,so the rest of the code uses env.port, env.mongoUri and so on.

// Next: STEP 2: (Connect to MongoDB) -> server/src/config/database.ts

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri:
    process.env.MONGO_URL||
    "mongodb+srv://naomiabiona8_db_user:orsqvtZd06SrjWe9@cluster0.3w60snd.mongodb.net/quickcart",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15d", //"Remain logged in for 15 days"
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
