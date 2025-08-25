import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    currency: String,
    stock: Number,
    sku: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: String,
    images: [String],
    specifications: Object,
    variants: Array
});

const Product = mongoose.model('Product', productSchema);
export default Product;