import mysql from "mysql";


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "213.171.200.97",
  user: "fshduia",
  password: "EEmm23?!",
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
    
          // Send the song requests as a response
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
    } else {
      return res.status(405).json({ error: "Method not allowed." });
    }
  }
