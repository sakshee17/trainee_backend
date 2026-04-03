import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersRoutes from "./routes/user.route.js";
import pool from "./db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 3001;

const init = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
    `);
    console.log("Database ready");
  } catch (err) {
    console.error("Database initialization error:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

init();