import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    priceAtAddTime: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            priceAtOrder: Number
        }
    ],
    total: Number,
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    cart: [cartItemSchema],
    orders: [orderSchema]
});

const User = mongoose.model('User', userSchema);
export default User;
