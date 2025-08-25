import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Register products route
import productsRouter from './routes/products.js';
app.use('/api/products', productsRouter);

// Register categories route
import categoriesRouter from './routes/categories.js';
app.use('/api/categories', categoriesRouter);

// Register auth route
import authRouter from './routes/auth.js';
app.use('/api/auth', authRouter);

// Register orders route
import ordersRouter from './routes/orders.js';
app.use('/api/orders', ordersRouter);

// Register cart route
import cartRouter from './routes/cart.js';
app.use('/api/cart', cartRouter);

// Register admin products route
import adminProductsRouter from './routes/adminProducts.js';
app.use('/api/admin/products', adminProductsRouter);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;