import React, { useEffect } from 'react';
import './App.css';
import PageContainer from './container/PageContainer';
import Header from './components/Header';
import RouterConfig from './config/RouterConfig';
import Loading from './components/Loading';
import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { calculateBasket, setDrawer, removeFromBasket } from './redux/slices/basketSlice';
import BasketDrawer from './components/BasketDrawer';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

function App() {
  const { products, drawer, totalPrice } = useSelector((store) => store.basket);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateBasket());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromBasket(productId));
    dispatch(calculateBasket());
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <CartProvider user={user}>
      <PageContainer>
        <Header />
        <RouterConfig />
        <Loading />
        <BasketDrawer />
      </PageContainer>
    </CartProvider>
  );
}

export default App;