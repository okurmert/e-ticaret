import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AccountDetails.css';

export default function AccountDetails() {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCart() {
            try {
                const res = await fetch('/api/cart', { credentials: 'include' });
                if (res.ok) {
                    setCart(await res.json());
                } else {
                    setCart([]);
                }
            } catch {
                setCart([]);
            }
        }
        fetchCart();
    }, []);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch('/api/orders', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Siparişler yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        }
        if (user) fetchOrders();
    }, [user]);

    const removeFromCart = async (productId) => {
        try {
            const res = await fetch('/api/cart/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ productId })
            });
            if (res.ok) {
                const updatedCart = await res.json();
                setCart(updatedCart);
            }
        } catch (error) {
            console.error("Sepetten ürün kaldırılırken hata:", error);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const res = await fetch('/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ productId, quantity: newQuantity })
            });
            if (res.ok) {
                const updatedCart = await res.json();
                setCart(updatedCart);
            }
        } catch (error) {
            console.error("Sepet güncellenirken hata:", error);
        }
    };

    if (!user) {
        return (
            <div className="account-login-prompt">
                <h2>Hesap Bilgileri</h2>
                <p>Lütfen hesabınıza giriş yapınız.</p>
                <a href="/login" className="login-redirect-btn">Giriş Yap</a>
            </div>
        );
    }


    return (
        <div className="account-details-container">
            <div className="account-header">
                <h2>Hesabım</h2>
                <p className="welcome-message">Hoş geldiniz, {user.name || user.email}</p>
            </div>

            <div className="account-section">
                <h3 className="section-title">
                    <i className="fas fa-shopping-cart"></i> Sepetiniz
                </h3>
                {Array.isArray(cart) && cart.length > 0 ? (
                    <>
                        {cart.map(item => (
                            <div key={item.productId?._id || item.productId} className="cart-item">
                                <div className="product-image-placeholder">
                                    <img
                                        src={item.productId?.images?.[0] || '/images/default-product.jpg'}
                                        alt={item.productId?.title || 'Ürün'}
                                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                                        onError={e => { e.target.src = '/images/default-product.jpg'; }}
                                    />
                                </div>
                                <div className="product-info">
                                    <h4 className="product-title">
                                        {item.title || item.productId?.title || `Ürün ID: ${item.productId?._id || 'Bilinmiyor'}`}
                                    </h4>
                                    <div className="product-meta">
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="product-quantity">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="product-price">
                                            {typeof item.priceAtAddTime === 'number'
                                                ? (item.priceAtAddTime * item.quantity).toFixed(2)
                                                : '--'} ₺
                                        </span>
                                    </div>
                                    <button
                                        className="remove-item"
                                        onClick={() => removeFromCart(item.productId?._id)}
                                    >
                                        <i className="fas fa-trash"></i> Kaldır
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            className="complete-order-btn"
                            onClick={() => navigate('/payment')}
                        >
                            Siparişi Tamamla
                        </button>
                    </>
                ) : (
                    <p>Sepetiniz boş.</p>
                )}
            </div>

            <div className="account-section">
                <h3 className="section-title">
                    <i className="fas fa-history"></i> Sipariş Geçmişi
                </h3>
                {Array.isArray(orders) && orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Sipariş #: {order._id.substring(0, 8)}</span>
                                <span className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>

                            <div className="order-items-preview">
                                <ul>
                                    {Array.isArray(order.items) && order.items.length > 0 ? (
                                        order.items.map(item => (
                                            <li key={item.productId?._id || Math.random()}>
                                                {item.productId?.title || `Ürün ID: ${item.productId?._id || 'Bilinmiyor'}`} - Adet: {item.quantity} - Fiyat: {item.priceAtOrder} ₺
                                            </li>
                                        ))
                                    ) : (
                                        <li>Siparişinizde ürün yok.</li>
                                    )}
                                </ul>
                            </div>

                            <div className="order-footer">
                                <span className="order-total">
                                    {typeof order.total === 'number' ? order.total.toFixed(2) : '--'} ₺
                                </span>
                                <span className={`order-status ${(order.status || '').toLowerCase()}`}>
                                    {!order.status ? 'Durum Bilinmiyor' :
                                        order.status === 'Processing' ? 'İşleniyor' :
                                            order.status === 'Shipped' ? 'Kargoda' :
                                                order.status === 'Delivered' ? 'Teslim Edildi' : 'İptal Edildi'}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Henüz siparişiniz yok.</p>
                )}
            </div>
        </div>
    );
}