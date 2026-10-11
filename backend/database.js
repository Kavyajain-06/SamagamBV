
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

// Safely add expires_at to existing verified_emails tables.
const columns = db.prepare(
    "PRAGMA table_info(verified_emails)"
).all();

const hasExpiryColumn = columns.some(
    column => column.name === 'expires_at'
);

if (columns.length > 0 && !hasExpiryColumn) {
    db.exec(`
        ALTER TABLE verified_emails
        ADD COLUMN expires_at DATETIME;
    `);

    // Give existing verification records a short expiry window.
    db.exec(`
        UPDATE verified_emails
        SET expires_at = datetime('now', '+10 minutes')
        WHERE expires_at IS NULL;
    `);
}

console.log('Samagam database initialized successfully.');

module.exports = db;
