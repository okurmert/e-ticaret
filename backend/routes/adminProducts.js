import express from 'express';
import Product from '../models/Product.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, isAdmin, async (req, res) => {
    const products = await Product.find().populate('category');
    res.json(products);
});

// Delete a product (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Edit a product (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// Create a new product (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Bir hata oluştu!' });
    }
});

export default router;