const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/reviews/:productId
router.get('/:productId', (req, res) => {
    try {
        const db = getDb();
        const reviews = db.prepare(`SELECT r.*, u.username, u.full_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC`).all(req.params.productId);
        const avg = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ?').get(req.params.productId);
        res.json({ reviews, average: avg.avg ? Math.round(avg.avg * 10) / 10 : 0, count: avg.count });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/reviews
router.post('/', requireAuth, (req, res) => {
    try {
        const { product_id, rating, title, comment } = req.body;
        if (!product_id || !rating) return res.status(400).json({ error: 'Product and rating required' });
        const db = getDb();
        const existing = db.prepare('SELECT id FROM reviews WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
        if (existing) return res.status(409).json({ error: 'You already reviewed this product' });
        db.prepare('INSERT INTO reviews (user_id, product_id, rating, title, comment) VALUES (?,?,?,?,?)').run(req.user.id, product_id, rating, title, comment);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
