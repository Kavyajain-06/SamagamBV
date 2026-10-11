
const express = require('express');
const crypto = require('crypto');
const db = require('./database');
const bcrypt = require('bcryptjs');
const authenticateToken = require('./authMiddleware');

const router = express.Router();

const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;

function hashOtp(otp) {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret === 'replace_with_your_own_random_secret') {
        throw new Error('A valid JWT_SECRET must be configured.');
    }

    return crypto
        .createHmac('sha256', secret)
        .update(otp)
        .digest('hex');
}

router.post('/signup/request-otp', (req, res) => {
    try {
        const email = String(req.body.email || '')
            .trim()
            .toLowerCase();

        if (!/^[^\s@]+@banasthali\.in$/i.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please use a valid @banasthali.in email.'
            });
        }

        // Allow development OTP testing only when explicitly enabled.
        if (process.env.OTP_DEV_MODE !== 'true') {
            return res.status(503).json({
                status: 'error',
                message: 'Email delivery is not configured yet.'
            });
        }

        const recentOtp = db.prepare(`
            SELECT id
            FROM email_otps
            WHERE college_email = ?
              AND created_at > datetime(
                  'now',
                  '-${RESEND_COOLDOWN_SECONDS} seconds'
              )
            ORDER BY id DESC
            LIMIT 1
        `).get(email);

        if (recentOtp) {
            return res.status(429).json({
                status: 'error',
                message: 'Please wait 60 seconds before requesting another OTP.'
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = hashOtp(otp);

        const createOtp = db.transaction(() => {
            // Remove older OTPs for this email.
            db.prepare(`
                DELETE FROM email_otps
                WHERE college_email = ?
            `).run(email);

            db.prepare(`
                INSERT INTO email_otps (
                    college_email,
                    otp_hash,
                    expires_at,
                    attempts
                )
                VALUES (
                    ?,
                    ?,
                    datetime('now', '+${OTP_EXPIRY_MINUTES} minutes'),
                    0
                )
            `).run(email, otpHash);
        });

        createOtp();

        // Development only: never enable this mode in production.
        console.log(`[DEV ONLY] OTP for ${email}: ${otp}`);

        return res.json({
            status: 'success',
            message: 'OTP generated for development testing.'
        });
    } catch (error) {
        console.error('OTP request failed:', error.message);

        return res.status(500).json({
            status: 'error',
            message: 'Unable to process the OTP request.'
        });
    }
});
router.post('/signup/verify-otp', (req, res) => {
    try {
        const email = String(req.body.email || '')
            .trim()
            .toLowerCase();

        const otp = String(req.body.otp || '').trim();

        // Validate email and OTP format.
        if (
            !/^[^\s@]+@banasthali\.in$/i.test(email) ||
            !/^\d{6}$/.test(otp)
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'Enter a valid college email and six-digit OTP.'
            });
        }

        // Find the latest OTP for this email.
        const record = db.prepare(`
            SELECT id, otp_hash, expires_at, attempts
            FROM email_otps
            WHERE college_email = ?
            ORDER BY id DESC
            LIMIT 1
        `).get(email);

        if (!record) {
            return res.status(400).json({
                status: 'error',
                message: 'No OTP found. Please request a new one.'
            });
        }

        // Reject expired OTPs.
        const isExpired = db.prepare(`
            SELECT datetime(?) <= datetime('now') AS expired
        `).get(record.expires_at).expired;

        if (isExpired) {
            db.prepare('DELETE FROM email_otps WHERE id = ?')
                .run(record.id);

            return res.status(400).json({
                status: 'error',
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Allow a maximum of five verification attempts.
        if (record.attempts >= 5) {
            db.prepare('DELETE FROM email_otps WHERE id = ?')
                .run(record.id);

            return res.status(429).json({
                status: 'error',
                message: 'Too many attempts. Please request a new OTP.'
            });
        }

        const submittedHash = Buffer.from(hashOtp(otp), 'hex');
        const storedHash = Buffer.from(record.otp_hash, 'hex');

        const matches =
            submittedHash.length === storedHash.length &&
            crypto.timingSafeEqual(submittedHash, storedHash);

        if (!matches) {
            const nextAttempts = record.attempts + 1;

            if (nextAttempts >= 5) {
                db.prepare('DELETE FROM email_otps WHERE id = ?')
                    .run(record.id);
            } else {
                db.prepare(`
                    UPDATE email_otps
                    SET attempts = ?
                    WHERE id = ?
                `).run(nextAttempts, record.id);
            }

            return res.status(400).json({
                status: 'error',
                message: nextAttempts >= 5
                    ? 'Too many attempts. Please request a new OTP.'
                    : 'Incorrect OTP. Please try again.'
            });
        }

        // OTP is valid: consume it so it cannot be reused.
        // OTP is valid: record the verified email and consume the OTP.
    const completeVerification = db.transaction(() => {
        db.prepare(`
            INSERT OR REPLACE INTO verified_emails (college_email, expires_at)
            VALUES (?, datetime('now', '+10 minutes'))
        `).run(email);

        db.prepare('DELETE FROM email_otps WHERE id = ?')
            .run(record.id);
    });

    completeVerification();

    return res.json({
        status: 'success',
        message: 'Email OTP verified successfully.'
    });

    } catch (error) {
        console.error('OTP verification failed:', error.message);

        return res.status(500).json({
            status: 'error',
            message: 'Unable to verify the OTP.'
        });
    }
});
router.post('/signup', async (req, res) => {
    try {
        const name = String(req.body.name || '').trim();
        const email = String(req.body.email || '')
            .trim()
            .toLowerCase();
        const password = String(req.body.password || '');

        if (!name || !/^[^\s@]+@banasthali\.in$/i.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Enter a name and valid @banasthali.in email.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 8 characters long.'
            });
        }

        const verification = db.prepare(`
            SELECT college_email
            FROM verified_emails
            WHERE college_email = ?
              AND datetime(expires_at) > datetime('now')
        `).get(email);

        if (!verification) {
            return res.status(400).json({
                status: 'error',
                message: 'Please verify your email first, or verify it again.'
            });
        }

        const existingUser = db.prepare(`
            SELECT id FROM users WHERE college_email = ?
        `).get(email);

        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'An account with this email already exists.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const createUser = db.transaction(() => {
            // Recheck verification inside the transaction.
            const validVerification = db.prepare(`
                SELECT college_email
                FROM verified_emails
                WHERE college_email = ?
                  AND datetime(expires_at) > datetime('now')
            `).get(email);

            if (!validVerification) {
                throw new Error('EMAIL_VERIFICATION_EXPIRED');
            }

            const result = db.prepare(`
                INSERT INTO users (
                    name,
                    college_email,
                    password_hash,
                    email_verified
                )
                VALUES (?, ?, ?, 1)
            `).run(name, email, passwordHash);

            db.prepare(`
                DELETE FROM verified_emails
                WHERE college_email = ?
            `).run(email);

            return result.lastInsertRowid;
        });

        const userId = createUser();

        return res.status(201).json({
            status: 'success',
            message: 'Account created successfully.',
            user: {
                id: userId,
                name,
                email
            }
        });
    } catch (error) {
        if (error.message === 'EMAIL_VERIFICATION_EXPIRED') {
            return res.status(400).json({
                status: 'error',
                message: 'Email verification expired. Please verify again.'
            });
        }

        if (
            error.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
            error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY'
        ) {
            return res.status(409).json({
                status: 'error',
                message: 'An account with this email already exists.'
            });
        }

        console.error('Signup failed:', error.message);

        return res.status(500).json({
            status: 'error',
            message: 'Unable to create your account.'
        });
    }
});
router.post('/login', async (req, res) => {
    try {
        const email = String(req.body.email || '')
            .trim()
            .toLowerCase();
        const password = String(req.body.password || '');

        if (
            !/^[^\s@]+@banasthali\.in$/i.test(email) ||
            !password
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'Enter a valid college email and password.'
            });
        }

        const user = db.prepare(`
            SELECT id, name, college_email, password_hash, role
            FROM users
            WHERE college_email = ?
              AND email_verified = 1
        `).get(email);

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password.'
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password.'
            });
        }

        const token = require('jsonwebtoken').sign(
            {
                id: user.id,
                email: user.college_email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            status: 'success',
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.college_email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login failed:', error.message);

        return res.status(500).json({
            status: 'error',
            message: 'Unable to process login.'
        });
    }
});

router.get('/me', authenticateToken, (req, res) => {
    try {
        const user = db.prepare(`
            SELECT id, name, college_email, role, email_verified, created_at
            FROM users
            WHERE id = ?
        `).get(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User account not found.'
            });
        }

        return res.json({
            status: 'success',
            user: {
                id: user.id,
                name: user.name,
                email: user.college_email,
                role: user.role,
                emailVerified: user.email_verified === 1,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Fetching current user failed:', error.message);

        return res.status(500).json({
            status: 'error',
            message: 'Unable to fetch user details.'
        });
    }
});

module.exports = router;
