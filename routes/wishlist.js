const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/wishlist
router.get('/', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const items = db.prepare(`SELECT w.*, p.name, p.slug, p.price, p.image_url, p.manufacturer, p.category, p.status FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ? ORDER BY w.added_at DESC`).all(req.user.id);
        res.json({ items });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/wishlist
router.post('/', requireAuth, (req, res) => {
    try {
        const { product_id } = req.body;
        const db = getDb();
        const existing = db.prepare('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
        if (existing) return res.json({ success: true, message: 'Already in wishlist' });
        db.prepare('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)').run(req.user.id, product_id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', requireAuth, (req, res) => {
    try {
        const db = getDb();
        db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(req.user.id, req.params.productId);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
