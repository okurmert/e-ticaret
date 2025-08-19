import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    currency: String,
    stock: Number,
    sku: String,
    category: String,
    brand: String,
    images: [String],
    specifications: Object,
    variants: Array
});

const Product = mongoose.model('Product', productSchema);
export default Product;