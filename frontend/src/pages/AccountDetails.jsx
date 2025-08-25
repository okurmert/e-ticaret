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

    const cartTotal = Array.isArray(cart)
        ? cart.reduce((sum, item) => {
            const price = typeof item.priceAtAddTime === 'number' ? item.priceAtAddTime : 0;
            return sum + price * item.quantity;
        }, 0)
        : 0;

    if (!user) {
        return (
            <div className="acc-d-account-login-prompt">
                <h2>Hesap Bilgileri</h2>
                <p>Lütfen hesabınıza giriş yapınız.</p>
                <a href="/login" className="acc-d-login-redirect-btn">Giriş Yap</a>
            </div>
        );
    }


    return (
        <div className="acc-d-account-details-container">
            <div className="acc-d-account-header">
                <h2>Hesabım</h2>
                <p className="acc-d-welcome-message">Hoş geldiniz, {user.name || user.email}</p>
            </div>

            <div className="acc-d-account-section">
                <h3 className="acc-d-section-title">
                    <i className="fas fa-shopping-cart"></i> Sepetiniz
                </h3>
                {Array.isArray(cart) && cart.length > 0 ? (
                    <>
                        {cart.map(item => (
                            <div key={item.productId?._id || item.productId} className="acc-d-cart-item">
                                <div className="acc-d-product-image-placeholder">
                                    <img
                                        src={item.productId?.images?.[0] || '/images/default-product.jpg'}
                                        alt={item.productId?.title || 'Ürün'}
                                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                                        onError={e => { e.target.src = '/images/default-product.jpg'; }}
                                    />
                                </div>
                                <div className="acc-d-product-info">
                                    <h4 className="acc-d-product-title">
                                        {item.title || item.productId?.title || `Ürün ID: ${item.productId?._id || 'Bilinmiyor'}`}
                                    </h4>
                                    <div className="acc-d-product-meta">
                                        <div className="acc-d-quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="acc-d-product-quantity">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="acc-d-product-price">
                                            {typeof item.priceAtAddTime === 'number'
                                                ? (item.priceAtAddTime * item.quantity).toFixed(2)
                                                : '--'} ₺
                                        </span>
                                    </div>
                                    <button
                                        className="acc-d-remove-item"
                                        onClick={() => removeFromCart(item.productId?._id)}
                                    >
                                        <i className="fas fa-trash"></i> Kaldır
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="acc-d-cart-total">
                            <strong>Toplam Tutar:</strong> {cartTotal.toFixed(2)} ₺
                        </div>
                        <button
                            className="acc-d-complete-order-btn"
                            onClick={() => navigate('/payment')}
                        >
                            Siparişi Tamamla
                        </button>
                    </>
                ) : (
                    <p>Sepetiniz boş.</p>
                )}
            </div>

            <div className="acc-d-account-section">
                <h3 className="acc-d-section-title">
                    <i className="fas fa-history"></i> Sipariş Geçmişi
                </h3>
                {Array.isArray(orders) && orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order._id} className="acc-d-order-card">
                            <div className="acc-d-order-header">
                                <span className="acc-d-order-id">Sipariş #: {order._id.substring(0, 8)}</span>
                                <span className="acc-d-order-date">
                                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>

                            <div className="acc-d-order-items-preview">
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

                            <div className="acc-d-order-footer">
                                <span className="acc-d-order-total">
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