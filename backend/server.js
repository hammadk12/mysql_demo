require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

//MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});

// Route
app.post('/api/signup', (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;

    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format, no dashes.'})
    }
    
    const sql = 'INSERT INTO users (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)';

    db.query(sql, [firstName, lastName, email, phoneNumber], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).json({ error: 'Error creating user' });
            return;
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
});

// Phone number validation
function isValidPhoneNumber(phoneNumber) {
    return /^\d{10}$/.test(phoneNumber);
}