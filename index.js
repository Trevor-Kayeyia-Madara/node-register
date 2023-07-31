const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 5000; // You can choose any port you prefer

// PostgreSQL database configuration
const pool = new Pool({
  user: 'ntkrxmgn',
  host: 'trumpet.db.elephantsql.com',
  database: 'ntkrxmgn',
  password: 'o-Hu2HJIiUlSZWcwo3I69FrJqXNoVia9',
  port: 5432, // Replace with your PostgreSQL port if different
});

// Define a function to create the table if it doesn't exist
async function createTableIfNotExists() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS registers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(10) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        micro_church VARCHAR(100),
        area_of_residence VARCHAR(100),
        business_interest TEXT
      )
    `;

    await pool.query(createTableQuery);
    console.log('Table "registers" created (if not existed).');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Call the function to create the table at application startup
createTableIfNotExists();

app.use(express.json()); // To parse JSON data from requests

// Define a route for handling registration form submission (POST)
app.post('/register', async (req, res) => {
  try {
    const {
      title,
      first_name,
      last_name,
      email,
      phone_number,
      micro_church,
      area_of_residence,
      business_interest,
    } = req.body;

    const query = `
      INSERT INTO registers (title, first_name, last_name, email, phone_number, micro_church, area_of_residence, business_interest)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const values = [
      title,
      first_name,
      last_name,
      email,
      phone_number,
      micro_church,
      area_of_residence,
      business_interest,
    ];

    await pool.query(query, values);

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Define a route for fetching registration data (GET)
app.get('/register', async (req, res) => {
  try {
    const query = `SELECT * FROM registers`;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching registration data:', error);
    res.status(500).json({ error: 'Failed to fetch registration data.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
