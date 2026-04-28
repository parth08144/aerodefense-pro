const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');

// GET /api/products
router.get('/', (req, res) => {
    try {
        const db = getDb();
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (req.query.category) { query += ' AND category = ?'; params.push(req.query.category); }
        if (req.query.manufacturer) { query += ' AND manufacturer LIKE ?'; params.push('%' + req.query.manufacturer + '%'); }
        if (req.query.status) { query += ' AND status = ?'; params.push(req.query.status); }
        if (req.query.generation) { query += ' AND generation = ?'; params.push(req.query.generation); }
        if (req.query.minPrice) { query += ' AND price >= ?'; params.push(parseFloat(req.query.minPrice)); }
        if (req.query.maxPrice) { query += ' AND price <= ?'; params.push(parseFloat(req.query.maxPrice)); }
        if (req.query.search) { query += ' AND (name LIKE ? OR manufacturer LIKE ? OR description LIKE ?)'; const s = '%' + req.query.search + '%'; params.push(s, s, s); }
        if (req.query.featured) { query += ' AND featured = 1'; }

        const sort = req.query.sort || 'featured';
        switch (sort) {
            case 'price-asc': query += ' ORDER BY price ASC'; break;
            case 'price-desc': query += ' ORDER BY price DESC'; break;
            case 'name': query += ' ORDER BY name ASC'; break;
            case 'newest': query += ' ORDER BY created_at DESC'; break;
            default: query += ' ORDER BY featured DESC, created_at DESC';
        }

        const products = db.prepare(query).all(...params);
        res.json({ products, total: products.length });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/products/categories/count
router.get('/categories/count', (req, res) => {
    try {
        const db = getDb();
        const counts = db.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category').all();
        res.json({ categories: counts });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/products/:slug
router.get('/:slug', (req, res) => {
    try {
        const db = getDb();
        const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const specs = db.prepare('SELECT * FROM product_specs WHERE product_id = ? ORDER BY spec_group, display_order').all(product.id);
        const reviews = db.prepare(`SELECT r.*, u.username, u.full_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC`).all(product.id);
        const related = db.prepare('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4').all(product.category, product.id);

        const specGroups = {};
        specs.forEach(s => { if (!specGroups[s.spec_group]) specGroups[s.spec_group] = []; specGroups[s.spec_group].push(s); });

        res.json({ product, specs: specGroups, reviews, related });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
