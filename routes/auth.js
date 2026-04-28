const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');
const { requireAuth } = require('../middleware/auth');

// POST /api/auth/signup
router.post('/signup', (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password are required' });
        if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

        const db = getDb();
        const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
        if (existing) return res.status(409).json({ error: 'Username or email already exists' });

        const hash = bcrypt.hashSync(password, 12);
        const result = db.prepare('INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)').run(username, email, hash, full_name || username);

        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, user: { id: result.lastInsertRowid, username, email, full_name: full_name || username } });
    } catch (err) { res.status(500).json({ error: 'Server error: ' + err.message }); }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name, role: user.role } });
    } catch (err) { res.status(500).json({ error: 'Server error: ' + err.message }); }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, (req, res) => {
    try {
        const { full_name, phone, address, city, country } = req.body;
        const db = getDb();
        db.prepare('UPDATE users SET full_name=?, phone=?, address=?, city=?, country=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
            .run(full_name, phone, address, city, country, req.user.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
