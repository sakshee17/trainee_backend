import express from "express";
import pool from "../db.js";

const router = express.Router();


// GET users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});


// POST user
router.post("/", async (req, res) => {

  try {

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "name and email required"
      });
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "invalid email"
      });
    }

    const result = await pool.query(
      "INSERT INTO users(name,email) VALUES($1,$2) RETURNING *",
      [name, email]
    );

    res.json(result.rows[0]);

  } catch (err) {

    if (err.code === "23505") {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    console.log(err);

    res.status(500).json({
      error: "server error"
    });

  }

});

// PUT user
router.put("/:id", async (req, res) => {

  try {

    const id = req.params.id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "email required"
      });
    }

    const result = await pool.query(
      "UPDATE users SET email=$1 WHERE id=$2 RETURNING *",
      [email, id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    if (err.code === "23505") {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({
      error: "server error"
    });

  }

});

export default router;