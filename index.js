const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3 module

const app = express();
const port = 5000; // You can choose any port you prefer

// SQLite3 database configuration
const db = new sqlite3.Database('register.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Define a function to create the table if it doesn't exist
function createTableIfNotExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS registers (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      micro_church TEXT,
      area_of_residence TEXT,
      business_interest TEXT
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table "registers" created (if not existed).');
    }
  });
}

// Call the function to create the table at application startup
createTableIfNotExists();

app.use(express.json()); // To parse JSON data from requests

// Define a route for handling registration form submission (POST)
app.post('/register', (req, res) => {
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

  const insertQuery = `
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

  db.run(insertQuery, values, (err) => {
    if (err) {
      console.error('Error during registration:', err.message);
      res.status(500).json({ error: 'Registration failed.' });
    } else {
      res.status(201).json({ message: 'Registration successful!' });
    }
  });
});

// Define a route for fetching registration data (GET)
app.get('/register', (req, res) => {
  const selectQuery = `SELECT * FROM registers`;

  db.all(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error fetching registration data:', err.message);
      res.status(500).json({ error: 'Failed to fetch registration data.' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
