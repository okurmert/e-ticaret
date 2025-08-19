import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../redux/slices/productSlice';
import { addToBasket, calculateBasket } from '../redux/slices/basketSlice';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { FaShoppingCart, FaStar, FaRegStar, FaTruck, FaShieldAlt, FaExchangeAlt } from "react-icons/fa";
import '../css/ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((store) => store.product);
    const [count, setCount] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedProduct.images && selectedProduct.images.length > 0) {
            setMainImage(selectedProduct.images[0]);
        }
    }, [selectedProduct]);

    const increment = () => {
        if (count < (selectedProduct?.stock || 10)) {
            setCount(count + 1);
        }
    };

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const addBasket = async () => {
        if (!selectedProduct) return;

        const payload = {
            id,
            price: selectedProduct.price,
            images: selectedProduct.images,
            title: selectedProduct.title,
            description: selectedProduct.description,
            count
        };

        dispatch(addToBasket(payload));
        dispatch(calculateBasket());

        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    productId: selectedProduct._id,
                    quantity: count,
                    priceAtAddTime: selectedProduct.price,
                    title: selectedProduct.title,
                    imageUrl: selectedProduct.images?.[0] || ''
                })
            });
        }
    };

    const productRating = 4.5;
    const fullStars = Math.floor(productRating);
    const hasHalfStar = productRating % 1 >= 0.5;

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
        </div>
    );

    if (error) return <div className="error-message">Error: {error}</div>;
    if (!selectedProduct || !selectedProduct._id) return <div className="not-found">Ürün bulunamadı.</div>;

    return (
        <div className="product-detail-container">
            <div className="product-gallery">
                <div className="main-image-container">
                    <img
                        src={mainImage || '/images/default.jpg'}
                        alt={selectedProduct.title}
                        className="main-image"
                    />
                </div>
                <div className="thumbnail-container">
                    {selectedProduct.images && selectedProduct.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`${selectedProduct.title} ${idx + 1}`}
                            className={`thumbnail${mainImage === img ? ' active' : ''}`}
                            onClick={() => setMainImage(img)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </div>
            </div>

            {/* Ürün Bilgileri Bölümü */}
            <div className="product-info">
                <div className="product-header">
                    <h1 className="product-title">{selectedProduct.title}</h1>
                    <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                            i < fullStars ?
                                <FaStar key={i} className="star filled" /> :
                                (hasHalfStar && i === fullStars ?
                                    <FaStar key={i} className="star half" /> :
                                    <FaRegStar key={i} className="star" />
                                )
                        ))}
                        <span className="rating-text">({productRating})</span>
                    </div>
                </div>

                <p className="product-category">{selectedProduct.category?.name || selectedProduct.category}</p>
                <p className="product-brand">Marka: {selectedProduct.brand}</p>
                <p className="product-sku">SKU: {selectedProduct.sku}</p>

                <p className="product-description">{selectedProduct.description}</p>

                <div className="price-container">
                    <span className="current-price">{selectedProduct.price.toFixed(2)}₺</span>
                    {selectedProduct.originalPrice && (
                        <span className="original-price">{selectedProduct.originalPrice.toFixed(2)}₺</span>
                    )}
                    {selectedProduct.discountPercentage && (
                        <span className="discount-badge">%{selectedProduct.discountPercentage} İNDİRİM</span>
                    )}
                </div>

                <div className="stock-info">
                    {selectedProduct.stock > 0 ? (
                        <span className="in-stock">Stokta: {selectedProduct.stock} adet</span>
                    ) : (
                        <span className="out-of-stock">Stokta Yok</span>
                    )}
                </div>

                {selectedProduct.variants?.length > 0 && (
                    <div className="product-variants">
                        <h4>Varyant Seçenekleri</h4>
                        <div className="variant-options">
                            {selectedProduct.variants.map((variant, idx) => (
                                <div key={idx} className="variant-item">
                                    <div className="variant-row">
                                        <span className="variant-label">Renk:</span>
                                        <span className="variant-value">{variant.color}</span>
                                    </div>
                                    <div className="variant-row">
                                        <span className="variant-label">Beden:</span>
                                        <span className="variant-value">{variant.size}</span>
                                    </div>
                                    <div className="variant-row">
                                        <span className="variant-label">Fiyat:</span>
                                        <span className="variant-value">{variant.price}₺</span>
                                    </div>
                                    <div className="variant-row">
                                        <span className="variant-label">Stok:</span>
                                        <span className="variant-value">{variant.stock} adet</span>
                                    </div>
                                    <div className="variant-separator"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="quantity-control">
                    <button
                        onClick={decrement}
                        disabled={count <= 1}
                        className="quantity-btn"
                    >
                        <CiCircleMinus />
                    </button>
                    <span className="quantity">{count}</span>
                    <button
                        onClick={increment}
                        disabled={count >= selectedProduct.stock}
                        className="quantity-btn"
                    >
                        <CiCirclePlus />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        onClick={addBasket}
                        className="add-to-cart-btn"
                        disabled={selectedProduct.stock <= 0}
                    >
                        <FaShoppingCart className="cart-icon" />
                        Sepete Ekle
                    </button>
                    <button
                        onClick={() => navigate('/payment')}
                        className="add-to-cart-btn"
                        disabled={selectedProduct.stock <= 0}
                    >
                        Satın Al
                    </button>
                </div>

                <div className="delivery-info">
                    <div className="delivery-item">
                        <FaTruck className="delivery-icon" />
                        <span>Ücretsiz Kargo</span>
                    </div>
                    <div className="delivery-item">
                        <FaShieldAlt className="delivery-icon" />
                        <span>2 Yıl Garanti</span>
                    </div>
                    <div className="delivery-item">
                        <FaExchangeAlt className="delivery-icon" />
                        <span>14 Gün İade</span>
                    </div>
                </div>

                {selectedProduct.specifications && (
                    <div className="product-specs">
                        <h4>Teknik Özellikler</h4>
                        <ul className="specs-list">
                            {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                                <li key={key}>
                                    <span className="spec-key">{key}:</span>
                                    <span className="spec-value">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;