import mysql from "mysql";

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "213.171.200.97",
  user: "fshduia",
  password: process.env.PASSWORD,
  database: "apolga",
  connectTimeout: 20000
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Execute the SQL query to fetch all song requests from the database
    pool.query("SELECT * FROM song_requests WHERE user_table = " + req.query.id, (error, results) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching song requests." });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === "POST") {
    const { title, artist, comments, username } = req.body;

    const lowercaseUsername = username.toLowerCase();
    

    const query = 'SELECT * FROM music_users WHERE username = ?';
    const values = [lowercaseUsername];

    const results = await new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  
      if (results.length === 0) {
        res.status(401).json({ error: 'Invalid username or password.' });
        return;
      }
    const user_table = results[0].id;
    // Execute the SQL query to insert the song request into the database
    pool.query(
      "INSERT INTO song_requests (title, artist, comments, user_table) VALUES (?, ?, ?, ?)",
      [title, artist, comments, user_table],
      (error, results) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "An error occurred while processing the song request." });
        }
        return res.status(200).json({ message: "Song request added successfully." });
      }
    );
  } else if (req.method === "PATCH") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required for deletion." });
    }

    // Execute the SQL query to delete the song request from the database
    pool.query("DELETE FROM song_requests WHERE id = ?", [id], (error, results) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "An error occurred while deleting the song request." });
      }
      return res.status(200).json({ message: "Song request deleted successfully." });
    });
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
