const Database = require('better-sqlite3');
const db = new Database('task.db', { verbose: console.log });

db.exec(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)`);

module.exports = db;