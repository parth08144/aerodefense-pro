const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');

function authMiddleware(req, res, next) {
    const token = req.cookies?.token;
    if (!token) { req.user = null; return next(); }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const db = getDb();
        const user = db.prepare('SELECT id, username, email, full_name, role, avatar_url FROM users WHERE id = ?').get(decoded.id);
        req.user = user || null;
    } catch { req.user = null; }
    next();
}

function requireAuth(req, res, next) {
    if (!req.user) {
        if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Authentication required' });
        return res.redirect('/login');
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

module.exports = { authMiddleware, requireAuth, requireAdmin };
