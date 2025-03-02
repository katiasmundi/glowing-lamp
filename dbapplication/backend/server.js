const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to SQLite database (or create if not exists)
let db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to SQLite database.');

});

// Create a table if it does not exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nimimerkki TEXT,
    ammatti TEXT,
    pituus TEXT
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Table created or already exists.');
});

//add a user
app.post('/add-user', (req, res) => {
    const { nimimerkki, ammatti, pituus } = req.body;
    db.run(`INSERT INTO users (nimimerkki, ammatti, pituus) VALUES (?, ?, ?)`, [nimimerkki, ammatti, pituus], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `A row has been inserted with rowid ${this.lastID}` });
    });
});

// get all users
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});

// update a user
app.put('/update-user/:id', (req, res) => {
    const { id } = req.params;
    const { nimimerkki, ammatti, pituus } = req.body;
    db.run(`UPDATE users SET nimimerkki = ?, ammatti = ?, pituus = ? WHERE id = ?`, [nimimerkki, ammatti, pituus, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Row(s) updated: ${this.changes}` });
    });
});

// delete a user
app.delete('/delete-user/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Row(s) deleted: ${this.changes}` });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// komentoja:
// curl -X POST http://localhost:3000/add-user -H "Content-Type: application/json" -d '{"nimimerkki": "koodarikeijo", "ammatti": "devaaja", "pituus": "150cm"}'

// curl -X PUT http://localhost:3000/update-user/1 -H "Content-Type: application/json" -d '{"nimimerkki": 
// "koodarikeke", "ammatti": "pesispelaaja", "pituus": "149cm"}'

// curl -X DELETE http://localhost:3000/delete-user/2