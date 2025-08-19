import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ user, children }) {
  const [cart, setCart] = useState([]);

  // user giriliyse datadan değilse localden
  useEffect(() => {
    if (user) {
      fetch('/api/cart', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setCart(data));
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(localCart);
    }
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product._id, quantity })
      });
      const res = await fetch('/api/cart', { credentials: 'include' });
      setCart(await res.json());
    } else {
      let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = localCart.find(item => item.productId === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        localCart.push({
          productId: product._id,
          quantity,
          priceAtAddTime: product.price,
          timestamp: Date.now()
        });
      }
      localStorage.setItem('cart', JSON.stringify(localCart));
      setCart(localCart);
    }
  };

  const mergeCart = async () => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (localCart.length && user) {
      for (const item of localCart) {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(item)
        });
      }
      localStorage.removeItem('cart');
      const res = await fetch('/api/cart', { credentials: 'include' });
      setCart(await res.json());
    }
  };

  useEffect(() => {
    if (user) mergeCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}