const Database = require('better-sqlite3');
const path = require('path');

let db;

try {
  const dbPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/contacts.db'  // Render uses ephemeral storage
    : path.join(__dirname, 'contacts.db');
  
  db = new Database(dbPath);
  
  // Create table if it doesn't exist
  const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT
    )
  `);
  
  createTable.run();
  console.log('Connected to SQLite database. Contacts table ready.');
  
} catch (error) {
  console.error('Error opening database:', error.message);
  process.exit(1);
}

module.exports = db;