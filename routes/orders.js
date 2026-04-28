const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');
const { requireAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// POST /api/orders
router.post('/', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const { shipping_address, payment_method, notes } = req.body;
        const cartItems = db.prepare(`SELECT ci.*, p.price, p.name FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?`).all(req.user.id);
        if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const orderNumber = 'AD-' + uuidv4().slice(0, 8).toUpperCase();

        const createOrder = db.transaction(() => {
            const order = db.prepare('INSERT INTO orders (user_id, order_number, total_amount, payment_method, payment_status, shipping_address, notes, status) VALUES (?,?,?,?,?,?,?,?)').run(req.user.id, orderNumber, total, payment_method || 'card', 'completed', shipping_address, notes, 'confirmed');
            for (const item of cartItems) {
                db.prepare('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?,?,?,?)').run(order.lastInsertRowid, item.product_id, item.quantity, item.price);
            }
            db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
            return order.lastInsertRowid;
        });
        const orderId = createOrder();
        res.json({ success: true, orderId, orderNumber });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/orders
router.get('/', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
        res.json({ orders });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/orders/:id
router.get('/:id', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        const items = db.prepare('SELECT oi.*, p.name, p.slug, p.image_url, p.manufacturer FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?').all(order.id);
        res.json({ order, items });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
