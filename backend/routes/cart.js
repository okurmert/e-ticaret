import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// GET /cart - fetch user's cart with product details
router.get('/', authenticate, async (req, res) => {
    const user = await User.findById(req.user.id).populate('cart.productId');
    res.json(user.cart || []);
});

// POST /cart/add - add or update item in cart
router.post('/add', authenticate, async (req, res) => {
    const { productId, quantity, priceAtAddTime, title, imageUrl } = req.body;
    const user = await User.findById(req.user.id);

    const existing = user.cart.find(item => item.productId.equals(productId));
    if (existing) {
        existing.quantity += quantity;
        existing.priceAtAddTime = priceAtAddTime;
        existing.title = title;
        existing.imageUrl = imageUrl;
        existing.timestamp = new Date();
    } else {
        user.cart.push({
            productId,
            quantity,
            priceAtAddTime,
            title,
            imageUrl,
            timestamp: new Date()
        });
    }
    await user.save();
    res.json(user.cart);
});

// Remove item from cart
router.post('/remove', authenticate, async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();
    await user.populate('cart.productId');
    res.json(user.cart);
});

// Update item quantity in cart
router.post('/update', authenticate, async (req, res) => {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    const item = user.cart.find(item => item.productId.toString() === productId);
    if (item) {
        item.quantity = quantity;
        await user.save();
        await user.populate('cart.productId');
        res.json(user.cart);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

export default router;
