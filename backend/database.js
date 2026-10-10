
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'samagam.db');
const db = new Database(dbPath);

// Enforce foreign-key relationships.
db.pragma('foreign_keys = ON');

// Read and execute the database schema.
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);

console.log('Samagam database initialized successfully.');

module.exports = db;
