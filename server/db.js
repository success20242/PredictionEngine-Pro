const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY,
      home TEXT,
      away TEXT,
      league TEXT,
      date TEXT,
      confidence REAL
    )
  `);
});

module.exports = db;
