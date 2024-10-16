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

// Form Route
app.post('/api/signup', (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Tracking log
    console.log('Received signup request:', { firstName, lastName, email, phoneNumber });

    // Basic validation
    if (!firstName || firstName.length < 2) {
        return res.status(400).json({ error: 'First name must be at least 2 characters long' });
    }
    if (!lastName || lastName.length < 2) {
        return res.status(400).json({ error: 'Last name must be at least 2 characters long' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const sql = 'INSERT INTO users (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)';

    db.query(sql, [firstName, lastName, email, phoneNumber], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Error creating user: ' + err.message });
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
});

function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    return /^\d{10}$/.test(phoneNumber);
}

// Search Route

app.get('/api/search', (req, res) => {
    const searchName = req.query.name;
    const sql = `
    SELECT first_name, last_name, email, phone_number
    FROM users
    WHERE CONCAT(first_name, ' ', last_name) LIKE ?`;

    db.query(sql, [`%${searchName}%`], (err, results) =>
    {
        if (err) {
            console.error('Error searching users:', err)
            res.status(500).json({ error: 'Error searching users' });
            return;
        }
        res.json(results)
    })
})
