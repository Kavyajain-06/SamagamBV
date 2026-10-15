CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    college_email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'admin', 'club_moderator')),
    email_verified INTEGER NOT NULL DEFAULT 0
        CHECK (email_verified IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INTEGER PRIMARY KEY,
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS email_otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_email TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
INSERT OR IGNORE INTO skill_tags (name) VALUES
    ('C'),
    ('C++'),
    ('Java'),
    ('Python'),
    ('JavaScript'),
    ('TypeScript'),
    ('HTML & CSS'),
    ('React'),
    ('Node.js'),
    ('SQL'),
    ('Data Structures & Algorithms'),
    ('Git & GitHub'),
    ('Web Development'),
    ('App Development'),
    ('AI & Machine Learning'),
    ('Data Science'),
    ('Cybersecurity'),
    ('UI/UX Design'),
    ('Graphic Design'),
    ('Video Editing'),
    ('Photography'),
    ('Content Writing'),
    ('Public Speaking'),
    ('Communication'),
    ('Interview Preparation'),
    ('Resume Building'),
    ('Aptitude'),
    ('Leadership'),
    ('Chess'),
    ('Photography'),
    ('Guitar'),
    ('Singing'),
    ('Dance'),
    ('Fitness'),
    ('Sports'),
    ('Cooking');

CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    skill_type TEXT NOT NULL
        CHECK (skill_type IN ('offering', 'seeking')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (skill_id) REFERENCES skill_tags(id),
    UNIQUE (user_id, skill_id, skill_type)
);

CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_email_otps_college_email
ON email_otps (college_email);
CREATE TABLE IF NOT EXISTS verified_emails (
    college_email TEXT PRIMARY KEY,
    verified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL
);