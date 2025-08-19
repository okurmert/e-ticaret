import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();

// GET /api/products
// GET /api/products?category=CategoryName
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
          filter.category = req.query.category;
        }
        const products = await Product.find(filter);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;