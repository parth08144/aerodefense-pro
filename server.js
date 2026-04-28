require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authMiddleware);

// Cart count middleware for all views
app.use((req, res, next) => {
    if (req.user) {
        const { getDb } = require('./database/db');
        const db = getDb();
        const result = db.prepare('SELECT COALESCE(SUM(quantity), 0) as count FROM cart_items WHERE user_id = ?').get(req.user.id);
        res.locals.cartCount = result.count;
    } else {
        res.locals.cartCount = 0;
    }
    next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/reviews', require('./routes/reviews'));

// Page Routes
app.use('/', require('./routes/pages'));

// 404
app.use((req, res) => { res.status(404).render('404', { title: '404 — Not Found', user: req.user }); });

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Auto-seed database if empty (critical for cloud deploys)
try {
    const { getDb } = require('./database/db');
    const db = getDb();
    const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
    if (count.c === 0) {
        console.log('Empty database detected — running seed...');
        require('./database/seed');
    }
} catch (e) {
    console.log('Auto-seed: initializing database...');
    require('./database/seed');
}

app.listen(PORT, () => {
    console.log(`\n⟨ AERODEFENSE PRO ⟩ Server online at http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
