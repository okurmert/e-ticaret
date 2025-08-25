import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js'; // Add this import
import authenticate from './auth.js';
const router = express.Router();

function adminOnly(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// POST /api/products - add new product (admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
    const { title, price, images, description, category } = req.body;
    const product = new Product({ title, price, images, description, category });
    await product.save();
    res.json(product);
});

// GET /api/products
// GET /api/products?category=CategoryName
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            // Find category by name and use its ObjectId
            const categoryDoc = await Category.findOne({ name: req.query.category });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            } else {
                // Category not found, return empty array
                return res.json([]);
            }
        }
        const products = await Product.find(filter).populate('category');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/products - get all products (admin only)
router.get('/admin/products', authenticate, adminOnly, async (req, res) => {
    const products = await Product.find().populate('category');
    res.json(products);
});

export default router;