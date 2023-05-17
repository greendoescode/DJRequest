import bcrypt from 'bcrypt';
import mysql from 'mysql';
import { serialize } from 'cookie';

const pool = mysql.createPool({
    host: "213.171.200.97",
    user: "fshduia",
    password: process.env.PASSWORD,
    database: "apolga",
    connectionLimit: 10,
  });

export default async function login(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { username, password } = req.body;

  const lowercaseUsername = username.toLowerCase();

  const query = 'SELECT * FROM music_users WHERE username = ?';
  const values = [lowercaseUsername];

  try {
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

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    const salt = bcrypt.genSaltSync(10);
    const hashedUsername = bcrypt.hashSync(user.username, salt);

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    res.setHeader('Set-Cookie', serialize('user_id', hashedUsername, { path: '/', maxAge: 365, sameSite: 'true', secure: true }));

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    res.status(500).json({ error: 'Failed to login. Please try again later.' });
  }
}
