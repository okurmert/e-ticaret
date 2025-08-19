import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { basketSlice } from '../redux/slices/basketSlice';
import { FaTimes, FaTrash, FaShoppingBag } from 'react-icons/fa';
import '../css/BasketDrawer.css';
import { useCart } from '../context/CartContext';

const BasketDrawer = () => {
    const { products, totalPrice, drawer } = useSelector(state => state.basket);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart } = useCart();

    const handleDelete = (id) => {
        dispatch(basketSlice.actions.removeFromBasket(id));
        dispatch(basketSlice.actions.calculateBasket());
    };

    if (!drawer) return null;

    return (
        <div className="basket-drawer-overlay" onClick={() => dispatch(basketSlice.actions.setDrawer(false))}>
            <div className="basket-drawer" onClick={e => e.stopPropagation()}>
                <button
                    className="close-btn"
                    onClick={() => dispatch(basketSlice.actions.setDrawer(false))}
                    aria-label="Close basket"
                >
                    <FaTimes />
                </button>

                <h2>
                    <FaShoppingBag style={{ marginRight: '10px' }} />
                    Sepetim ({products.length})
                </h2>

                {products.length === 0 ? (
                    <div className="empty-basket">
                        <p>Sepetiniz boş</p>
                        <button
                            className="continue-shopping-btn"
                            onClick={() => {
                                dispatch(basketSlice.actions.setDrawer(false));
                                navigate('/');
                            }}
                        >
                            Alışverişe Devam Et
                        </button>
                    </div>
                ) : (
                    <>
                        <ul className="basket-list">
                            {products.map((item) => (
                                <li key={item.id} className="basket-item">
                                    <img
                                        src={item.images?.[0] || '/images/default-product.jpg'}
                                        alt={item.title}
                                        className="basket-item-image"
                                        onError={(e) => {
                                            e.target.src = '/images/default-product.jpg';
                                        }}
                                    />
                                    <div className="basket-item-info">
                                        <span className="basket-item-title">
                                            {item.title.length > 35 ? item.title.substring(0, 30) + '..' : item.title}
                                        </span>
                                        <span className="basket-item-price">
                                            {item.price.toFixed(2)} ₺ × {item.count} = {(item.price * item.count).toFixed(2)} ₺
                                        </span>
                                    </div>
                                    <button
                                        className="basket-delete-btn"
                                        onClick={() => handleDelete(item.id)}
                                        aria-label="Ürünü sil"
                                    >
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="basket-total">
                            Toplam: {totalPrice.toFixed(2)} ₺
                        </div>

                        <button
                            className="add-to-cart-btn"
                            onClick={() => {
                                dispatch(basketSlice.actions.setDrawer(false));
                                navigate('/payment');
                            }}
                            disabled={products.length === 0}
                        >
                            Ödemeye Geç
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BasketDrawer;