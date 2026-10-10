
require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('./database');

const domain = process.env.ALLOWED_EMAIL_DOMAIN;

if (!domain) {
    throw new Error('ALLOWED_EMAIL_DOMAIN is missing from .env');
}

const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users
    (name, college_email, password_hash, role, email_verified)
    VALUES (?, ?, ?, ?, 1)
`);

const insertSkill = db.prepare(`
    INSERT OR IGNORE INTO skill_tags (name)
    VALUES (?)
`);

const seed = db.transaction(() => {
    const adminHash = bcrypt.hashSync('AdminDemo123!', 10);
    const studentHash = bcrypt.hashSync('StudentDemo123!', 10);

    insertUser.run(
        'Demo Admin',
        `admin@${domain}`,
        adminHash,
        'admin'
    );

    insertUser.run(
        'Demo Student',
        `student@${domain}`,
        studentHash,
        'student'
    );

    const skills = [
        'C++',
        'Python',
        'Java',
        'JavaScript',
        'React',
        'SQL',
        'Web Development',
        'Data Structures and Algorithms'
    ];

    for (const skill of skills) {
        insertSkill.run(skill);
    }
});

seed();

console.log('Demo accounts and skills created successfully.');
console.log(`Admin email: admin@${domain}`);
console.log(`Student email: student@${domain}`);
console.log('Demo passwords are defined in seed.js.');
