import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../redux/slices/productSlice';
import { addToBasket, calculateBasket } from '../redux/slices/basketSlice';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { FaShoppingCart, FaStar, FaRegStar, FaTruck, FaShieldAlt, FaExchangeAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import '../css/ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((store) => store.product);
    const [count, setCount] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

    const nextImage = () => {
        if (selectedProduct.images && selectedProduct.images.length > 0) {
            const nextIndex = (currentImageIndex + 1) % selectedProduct.images.length;
            setCurrentImageIndex(nextIndex);
            setMainImage(selectedProduct.images[nextIndex]);
        }
    };

    const prevImage = () => {
        if (selectedProduct.images && selectedProduct.images.length > 0) {
            const prevIndex = (currentImageIndex - 1 + selectedProduct.images.length) % selectedProduct.images.length;
            setCurrentImageIndex(prevIndex);
            setMainImage(selectedProduct.images[prevIndex]);
        }
    };

    const selectImage = (img, index) => {
        setMainImage(img);
        setCurrentImageIndex(index);
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
        <div className="pd-loading-container">
            <div className="pd-loading-spinner"></div>
        </div>
    );

    if (error) return <div className="pd-error-message">Error: {error}</div>;
    if (!selectedProduct || !selectedProduct._id) return <div className="pd-not-found">Ürün bulunamadı.</div>;

    return (
        <div className="pd-product-detail-container">
            {/* Ürün Galerisi Bölümü - Güncellenmiş */}
            <div className="pd-product-gallery">
                <div className="pd-main-image-container">
                    <img
                        src={mainImage || '/images/default.jpg'}
                        alt={selectedProduct.title}
                        className="pd-main-image"
                    />

                    {/* Navigasyon okları (birden fazla resim varsa) */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <>
                            <button
                                className="pd-nav-button pd-prev-button"
                                onClick={prevImage}
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                className="pd-nav-button pd-next-button"
                                onClick={nextImage}
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}

                    {/* Resim sayacı */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <div className="pd-image-counter">
                            {currentImageIndex + 1} / {selectedProduct.images.length}
                        </div>
                    )}
                </div>

                {/* Küçük resimler (thumbnails) */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="pd-thumbnail-container">
                        {selectedProduct.images.map((img, index) => (
                            <div
                                key={index}
                                className={`pd-thumbnail-item ${mainImage === img ? 'pd-active' : ''}`}
                                onClick={() => selectImage(img, index)}
                            >
                                <img
                                    src={img}
                                    alt={`${selectedProduct.title} ${index + 1}`}
                                    className="pd-thumbnail-image"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ürün Bilgileri Bölümü */}
            <div className="pd-product-info">
                <div className="pd-product-header">
                    <h1 className="pd-product-detail-title">{selectedProduct.title}</h1>
                    <div className="pd-product-rating">
                        {[...Array(5)].map((_, i) => (
                            i < fullStars ?
                                <FaStar key={i} className="pd-star filled" /> :
                                (hasHalfStar && i === fullStars ?
                                    <FaStar key={i} className="pd-star half" /> :
                                    <FaRegStar key={i} className="pd-star" />
                                )
                        ))}
                        <span className="pd-rating-text">({productRating})</span>
                    </div>
                </div>

                <p className="pd-product-brand">Marka: {selectedProduct.brand}</p>
                <p className="pd-product-sku">SKU: {selectedProduct.sku}</p>

                <p className="pd-product-description">{selectedProduct.description}</p>

                <div className="pd-price-container">
                    <span className="pd-current-price">{selectedProduct.price.toFixed(2)}₺</span>
                    {selectedProduct.originalPrice && (
                        <span className="pd-original-price">{selectedProduct.originalPrice.toFixed(2)}₺</span>
                    )}
                    {selectedProduct.discountPercentage && (
                        <span className="pd-discount-badge">%{selectedProduct.discountPercentage} İNDİRİM</span>
                    )}
                </div>

                <div className="pd-stock-info">
                    {selectedProduct.stock > 0 ? (
                        <span className="pd-in-stock">Stokta: {selectedProduct.stock} adet</span>
                    ) : (
                        <span className="pd-out-of-stock">Stokta Yok</span>
                    )}
                </div>

                {selectedProduct.variants?.length > 0 && (
                    <div className="pd-product-variants">
                        <h4>Varyant Seçenekleri</h4>
                        <div className="pd-variant-options">
                            {selectedProduct.variants.map((variant, idx) => (
                                <div key={idx} className="pd-variant-item">
                                    <div className="pd-variant-row">
                                        <span className="pd-variant-label">Renk:</span>
                                        <span className="pd-variant-value">{variant.color}</span>
                                    </div>
                                    <div className="pd-variant-row">
                                        <span className="pd-variant-label">Beden:</span>
                                        <span className="pd-variant-value">{variant.size}</span>
                                    </div>
                                    <div className="pd-variant-row">
                                        <span className="pd-variant-label">Fiyat:</span>
                                        <span className="pd-variant-value">{variant.price}₺</span>
                                    </div>
                                    <div className="pd-variant-row">
                                        <span className="pd-variant-label">Stok:</span>
                                        <span className="pd-variant-value">{variant.stock} adet</span>
                                    </div>
                                    <div className="pd-variant-separator"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pd-quantity-control">
                    <button
                        onClick={decrement}
                        disabled={count <= 1}
                        className="pd-quantity-btn"
                    >
                        <CiCircleMinus />
                    </button>
                    <span className="pd-quantity">{count}</span>
                    <button
                        onClick={increment}
                        disabled={count >= selectedProduct.stock}
                        className="pd-quantity-btn"
                    >
                        <CiCirclePlus />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        onClick={addBasket}
                        className="pd-add-to-cart-btn"
                        disabled={selectedProduct.stock <= 0}
                    >
                        <FaShoppingCart className="pd-cart-icon" />
                        Sepete Ekle
                    </button>
                    <button
                        onClick={() => navigate('/payment')}
                        className="pd-add-to-cart-btn"
                        disabled={selectedProduct.stock <= 0}
                    >
                        Satın Al
                    </button>
                </div>

                <div className="pd-delivery-info">
                    <div className="pd-delivery-item">
                        <FaTruck className="pd-delivery-icon" />
                        <span>Ücretsiz Kargo</span>
                    </div>
                    <div className="pd-delivery-item">
                        <FaShieldAlt className="pd-delivery-icon" />
                        <span>2 Yıl Garanti</span>
                    </div>
                    <div className="pd-delivery-item">
                        <FaExchangeAlt className="pd-delivery-icon" />
                        <span>14 Gün İade</span>
                    </div>
                </div>

                {selectedProduct.specifications && (
                    <div className="pd-product-specs">
                        <h4>Teknik Özellikler</h4>
                        <ul className="pd-specs-list">
                            {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                                <li key={key}>
                                    <span className="pd-spec-key">{key}:</span>
                                    <span className="pd-spec-value">{value}</span>
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