import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Basket = () => {
  const { products, totalPrice } = useSelector(state => state.basket);
  const navigate = useNavigate();

  return (
    <div className="basket-container">
      <h2>Sepetim</h2>
      {products.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <ul>
          {products.map((item, idx) => (
            <li key={idx}>
              {item.title} - {item.price} ₺ x {item.count}
            </li>
          ))}
        </ul>
      )}
      <p>Toplam: {totalPrice} ₺</p>
      <button
        className="add-to-cart-btn"
        onClick={() => navigate('/payment')}
        disabled={products.length === 0}
      >
        Ödeme Yap
      </button>
    </div>
  );
};

export default Basket;