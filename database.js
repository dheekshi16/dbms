const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'college_admission.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS admissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            dob DATE NOT NULL,
            gender TEXT NOT NULL,
            address TEXT NOT NULL,
            course TEXT NOT NULL,
            gpa REAL,
            high_school TEXT,
            submission_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table: ' + err.message);
            } else {
                console.log('Admissions table ready.');
            }
        });
    }
});

module.exports = db;
