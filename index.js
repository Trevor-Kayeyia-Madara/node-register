const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 5000; // You can choose any port you prefer

// PostgreSQL database configuration for cloud-based service
const pool = new Pool({
  user: 'trevor',
  host: 'dpg-cj3le9unqql8v0dd1p40-a',
  database: 'register_postgres',
  password: '3tIxmiUecdCrqlbCLzFzhNZQRHir8EDE',
  port: 5432,
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

// Define a route for handling registration form submission
app.post('/register', async (req, res) => {
  try {
    const {
      title,
      firstName,
      lastName,
      email,
      phoneNumber,
      microChurch,
      areaOfResidence,
      businessInterest,
    } = req.body;

    const query = `
      INSERT INTO registers (title, first_name, last_name, email, phone_number, micro_church, area_of_residence, business_interest)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const values = [
      title,
      firstName,
      lastName,
      email,
      phoneNumber,
      microChurch,
      areaOfResidence,
      businessInterest,
    ];

    await pool.query(query, values);

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Define a route to fetch registered data
app.get('/register', async (req, res) => {
  try {
    const query = 'SELECT * FROM registers';
    const result = await pool.query(query);

    const registrations = result.rows;
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching registered data:', error);
    res.status(500).json({ error: 'Failed to fetch registered data.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
