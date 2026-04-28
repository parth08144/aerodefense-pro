const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/cart
router.get('/', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const items = db.prepare(`SELECT ci.*, p.name, p.slug, p.price, p.image_url, p.manufacturer, p.status, p.stock_quantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ? ORDER BY ci.added_at DESC`).all(req.user.id);
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        res.json({ items, total, count: items.length });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/cart
router.post('/', requireAuth, (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        const db = getDb();
        const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
        if (existing) {
            db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
        } else {
            db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(req.user.id, product_id, quantity);
        }
        const count = db.prepare('SELECT SUM(quantity) as count FROM cart_items WHERE user_id = ?').get(req.user.id);
        res.json({ success: true, cartCount: count.count });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/cart/:id
router.put('/:id', requireAuth, (req, res) => {
    try {
        const { quantity } = req.body;
        const db = getDb();
        if (quantity <= 0) { db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id); }
        else { db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?').run(quantity, req.params.id, req.user.id); }
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/cart/:id
router.delete('/:id', requireAuth, (req, res) => {
    try {
        const db = getDb();
        db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
