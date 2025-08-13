import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetail from '../components/ProductDetail';
import Search from '../pages/Search';
import Payment from '../pages/Payment';
import Basket from '../components/Basket';

export default function RouterConfig() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/product-details/:id" element={<ProductDetail />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/basket" element={<Basket />} />
    </Routes>
  );
}