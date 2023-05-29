import bcrypt from "bcrypt";
import mysql from "mysql";

const pool = mysql.createPool({
  host: "213.171.200.97",
  user: "fshduia",
  password: process.env.PASSWORD,
  database: "apolga",
  connectionLimit: 10,
});

export default function registerHandler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);

    const query = "INSERT INTO music_users (username, password) VALUES (?, ?)";
    const values = [username, hashedPassword];

    pool.query(query, values, (error, results) => {
      if (error) {
        console.error("Failed to register user:", error);
        res.status(500).json({ error: "Failed to register user" });
      } else {
        res.json({ message: "User registered successfully" });
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
