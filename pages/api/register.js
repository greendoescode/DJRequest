import bcrypt from "bcrypt";
import mysql from "mysql";

const pool = mysql.createPool({
  host: "213.171.200.97",
  user: "fshduia",
  password: process.env.PASSWORD,
  database: "apolga",
  connectionLimit: 10,
});

export default async function registerHandler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      // Check if the username already exists
      const usernameCheckQuery = "SELECT COUNT(*) AS count FROM music_users WHERE username = ?";
      const usernameCheckValues = [username.toLowerCase()];

      pool.query(usernameCheckQuery, usernameCheckValues, async (error, results) => {
        if (error) {
          console.error("Error checking username:", error);
          return res.status(500).json({ error: "Failed to register user" });
        }

        const usernameExists = results[0].count > 0;
        if (usernameExists) {
          return res.status(400).json({ error: "Username already exists" });
        }

        // Username is available, proceed with registration
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);

        const lowercaseUsername = username.toLowerCase();

        const insertQuery = "INSERT INTO music_users (username, password) VALUES (?, ?)";
        const insertValues = [lowercaseUsername, hashedPassword];

        pool.query(insertQuery, insertValues, (error, results) => {
          if (error) {
            console.error("Failed to register user:", error);
            // Refresh the page upon failed registration
            return res.status(400).send("Failed to create account.");
          }
          // Redirect to "/" upon successful registration
          res.writeHead(302, { Location: "/" });
          res.end();
        });
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
