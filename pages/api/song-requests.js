import mysql from "mysql";

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "213.171.200.97",
  user: "fshduia",
  password: process.env.PASSWORD,
  database: "apolga",
  connectTimeout: 20000
});

export default function handler(req, res) {
  if (req.method === "GET") {
    // Execute the SQL query to fetch all song requests from the database
    pool.query("SELECT * FROM song_requests", (error, results) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching song requests." });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === "POST") {
    const { title, artist, comments } = req.body;

    // Execute the SQL query to insert the song request into the database
    pool.query(
      "INSERT INTO song_requests (title, artist, comments) VALUES (?, ?, ?)",
      [title, artist, comments],
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
    console.log(req.body);

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
