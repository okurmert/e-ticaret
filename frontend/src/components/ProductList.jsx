import React from 'react';
import { Link } from 'react-router-dom';

const ProductsList = ({ products }) => {
    if (!products || products.length === 0) {
        return <p>Sonuç Bulunamadı.</p>;
    }
    return (
        <div className="products-list">
            {products.map(product => (
                <div key={product._id} className="product-card">
                    <Link to={`/product-details/${product._id}`}>
                        <img
                            src={product.images && product.images.length > 0 ? product.images[0] : '/images/default.jpg'}
                            alt={product.title}
                        />
                        <h3>{product.title}</h3>
                    </Link>
                    <p>{product.price} ₺</p>
                    <p>{product.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductsList;