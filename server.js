const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Serve HTML pages (Explicit routes for clarity, though static serves them too)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API: Submit Admission Form
app.post('/api/submit', (req, res) => {
    const { full_name, email, phone, dob, gender, address, course, gpa, high_school } = req.body;

    const sql = `INSERT INTO admissions (full_name, email, phone, dob, gender, address, course, gpa, high_school) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [full_name, email, phone, dob, gender, address, course, gpa, high_school];

    db.run(sql, params, function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to submit application.' });
            return;
        }
        res.json({ message: 'Application submitted successfully!', id: this.lastID });
    });
});

// API: Get All Admissions (For Admin)
app.get('/api/admissions', (req, res) => {
    const sql = "SELECT * FROM admissions ORDER BY submission_date DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
