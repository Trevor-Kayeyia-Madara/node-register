const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 5000; // You can choose any port you prefer

// PostgreSQL database configuration
const pool = new Pool({
  user: 'dcutawal_dcutawal',
  host: '/var/run/postgresql', // Assuming PostgreSQL is running on this host
  database: 'dcutawal_register',
  password: '@Utawala001',
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
    // ... (existing code for handling form submission)
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// ... (Other routes and middleware)

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
