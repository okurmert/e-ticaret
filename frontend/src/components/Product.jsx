import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../redux/slices/productSlice';
import '../css/Product.css'
import { useNavigate, Link } from 'react-router-dom';

const Product = ({ products: propProducts }) => {
    const dispatch = useDispatch();
    const { products: reduxProducts, loading, error } = useSelector(state => state.product);
    const navigate = useNavigate();

    useEffect(() => {
        if (!propProducts) {
            dispatch(getAllProducts());
        }
    }, [dispatch, propProducts]);

    const products = propProducts || reduxProducts;

    if (!propProducts && loading) return <div>Loading...</div>;
    if (!propProducts && error) return <div>Error: {error}</div>;

    return (
        <div className="p-product-list" >
            {products && products.length > 0 ? (
                products.map(product => (
                    <div key={product._id} className="p-product-card" >
                        <h3 className='p-product-title'>{product.title ? product.title.substring(0, 30) : "Başlık yok"}</h3>
                        <img
                            src={product.images && product.images.length > 0 ? product.images[0] : '/images/default.jpg'}
                            alt={product.title}
                            className='p-product-image'
                        />

                        <p className='p-product-price'>{product.price} ₺</p>
                        <p className='p-product-description'>
                            {product.description ? product.description.substring(0, 50) : "Açıklama yok"}...
                        </p>
                        <Link to={`/product-details/${product._id}`}>
                            <button className='p-detail-button'>Detaylı İncele</button>
                        </Link>
                    </div>
                ))
            ) : (
                <p>Ürün bulunamadı.</p>
            )}
        </div>
    );
};

export default Product;