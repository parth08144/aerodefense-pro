const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');
const { requireAuth } = require('../middleware/auth');

router.get('/', (req, res) => {
    const db = getDb();
    const featured = db.prepare('SELECT * FROM products WHERE featured = 1 LIMIT 6').all();
    const counts = db.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category').all();
    const totalProducts = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
    res.render('index', { title: 'AeroDefense Pro — Global Defense Marketplace', user: req.user, featured, counts, totalProducts });
});

router.get('/catalog', (req, res) => {
    const db = getDb();
    const manufacturers = db.prepare('SELECT DISTINCT manufacturer FROM products ORDER BY manufacturer').all();
    const generations = db.prepare('SELECT DISTINCT generation FROM products WHERE generation IS NOT NULL ORDER BY generation').all();
    res.render('catalog', { title: 'Catalog — AeroDefense Pro', user: req.user, manufacturers, generations, category: req.query.category || '' });
});

router.get('/product/:slug', (req, res) => {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
    if (!product) return res.status(404).render('404', { title: '404', user: req.user });
    const specs = db.prepare('SELECT * FROM product_specs WHERE product_id = ? ORDER BY spec_group, display_order').all(product.id);
    const reviews = db.prepare('SELECT r.*, u.username, u.full_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC').all(product.id);
    const related = db.prepare('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4').all(product.category, product.id);
    const specGroups = {};
    specs.forEach(s => { if (!specGroups[s.spec_group]) specGroups[s.spec_group] = []; specGroups[s.spec_group].push(s); });
    const avgReview = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ?').get(product.id);
    // Check wishlist status
    let inWishlist = false;
    if (req.user) { inWishlist = !!db.prepare('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?').get(req.user.id, product.id); }
    res.render('product', { title: product.name + ' — AeroDefense Pro', user: req.user, product, specGroups, reviews, related, avgReview, inWishlist });
});

router.get('/cart', requireAuth, (req, res) => {
    const db = getDb();
    const items = db.prepare('SELECT ci.*, p.name, p.slug, p.price, p.image_url, p.manufacturer, p.stock_quantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?').all(req.user.id);
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    res.render('cart', { title: 'Cart — AeroDefense Pro', user: req.user, items, total });
});

router.get('/checkout', requireAuth, (req, res) => {
    const db = getDb();
    const items = db.prepare('SELECT ci.*, p.name, p.price, p.image_url FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?').all(req.user.id);
    if (items.length === 0) return res.redirect('/cart');
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    res.render('checkout', { title: 'Checkout — AeroDefense Pro', user: req.user, items, total });
});

router.get('/order-confirmation/:id', requireAuth, (req, res) => {
    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!order) return res.redirect('/');
    const items = db.prepare('SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?').all(order.id);
    res.render('order-confirmation', { title: 'Order Confirmed — AeroDefense Pro', user: req.user, order, items });
});

router.get('/login', (req, res) => { if (req.user) return res.redirect('/'); res.render('login', { title: 'Login — AeroDefense Pro', user: null }); });
router.get('/signup', (req, res) => { if (req.user) return res.redirect('/'); res.render('signup', { title: 'Sign Up — AeroDefense Pro', user: null }); });

router.get('/profile', requireAuth, (req, res) => {
    const db = getDb();
    const fullUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const orderCount = db.prepare('SELECT COUNT(*) as c FROM orders WHERE user_id = ?').get(req.user.id).c;
    const wishCount = db.prepare('SELECT COUNT(*) as c FROM wishlist WHERE user_id = ?').get(req.user.id).c;
    res.render('profile', { title: 'Profile — AeroDefense Pro', user: req.user, fullUser, orderCount, wishCount });
});

router.get('/orders', requireAuth, (req, res) => {
    const db = getDb();
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.render('orders', { title: 'Orders — AeroDefense Pro', user: req.user, orders });
});

router.get('/wishlist', requireAuth, (req, res) => {
    const db = getDb();
    const items = db.prepare('SELECT w.*, p.name, p.slug, p.price, p.image_url, p.manufacturer, p.category, p.status FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?').all(req.user.id);
    res.render('wishlist', { title: 'Wishlist — AeroDefense Pro', user: req.user, items });
});

router.get('/about', (req, res) => { res.render('about', { title: 'About — AeroDefense Pro', user: req.user }); });

module.exports = router;
