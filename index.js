const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000; // You can choose any port you prefer

// MySQL database configuration
const dbConfig = {
    user: 'dcutawal', // Replace with your MySQL username (dcutawal@localhost)
    database: 'dcutawal_enteprenuership', // Replace with your MySQL database name
    socketPath: '/var/run/mysqld/mysqld.sock', // Replace with the path to your UNIX socket
  };

// Create a MySQL pool
const pool = mysql.createPool(dbConfig);

// Define a function to create the table if it doesn't exist
async function createTableIfNotExists() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS registers (
        id INT AUTO_INCREMENT PRIMARY KEY,
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

    pool.query(createTableQuery, (error, results) => {
      if (error) {
        console.error('Error creating table:', error);
      } else {
        console.log('Table "registers" created (if not existed).');
      }
    });
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Call the function to create the table at application startup
createTableIfNotExists();

app.use(cors({
  origin: '*' // Replace with your frontend's domain or use '*' for any origin
}));
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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

    pool.query(query, values, (error, results) => {
      if (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed.' });
      } else {
        res.status(201).json({ message: 'Registration successful!' });
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Define a route for fetching registration data (GET)
app.get('/register', async (req, res) => {
  try {
    const query = `SELECT * FROM registers`;
    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching registration data:', error);
        res.status(500).json({ error: 'Failed to fetch registration data.' });
      } else {
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error('Error fetching registration data:', error);
    res.status(500).json({ error: 'Failed to fetch registration data.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
