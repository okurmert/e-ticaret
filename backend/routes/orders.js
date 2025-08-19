import express from 'express';
import User from '../models/User.js';
import authenticate from './cart.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    const user = await User.findById(req.user.id).populate('orders.items.productId');
    res.json(user.orders || []);
});

export default router;