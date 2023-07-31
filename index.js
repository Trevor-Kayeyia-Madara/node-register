const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const port = 5000;

// Replace with your Supabase credentials
const supabaseUrl = 'https://qcmamloppghscunvukxc.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY'; // Replace with your Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

// Define a function to create the table if it doesn't exist
async function createTableIfNotExists() {
  try {
    // Supabase handles table creation automatically when you insert data
    console.log('Table "registers" created (if not existed).');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Call the function to create the table at application startup
createTableIfNotExists();

app.use(express.json());

// Use the cors middleware with specific options
app.use(cors({
  origin: 'https://www.dcutawal.com', // Replace with your React app's domain or '*' for any origin
  methods: 'GET,POST',
}));

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

    // Use Supabase's insert method to insert data into the 'registers' table
    const { data, error } = await supabase
      .from('registers')
      .insert({
        title,
        first_name,
        last_name,
        email,
        phone_number,
        micro_church,
        area_of_residence,
        business_interest,
      });

    if (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed.' });
    } else {
      res.status(201).json({ message: 'Registration successful!', data });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Define a route for fetching registration data (GET)
app.get('/register', async (req, res) => {
  try {
    // Use Supabase's select method to fetch data from the 'registers' table
    const { data, error } = await supabase.from('registers').select('*');

    if (error) {
      console.error('Error fetching registration data:', error);
      res.status(500).json({ error: 'Failed to fetch registration data.' });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error('Error fetching registration data:', error);
    res.status(500).json({ error: 'Failed to fetch registration data.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
