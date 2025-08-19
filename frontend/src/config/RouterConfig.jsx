import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import LoginSignUp from '../pages/LoginSignUp';
import Search from '../pages/Search';
import ProductDetail from '../components/ProductDetail';
import Payment from '../pages/Payment';
import Basket from '../components/Basket';
import AccountDetails from '../pages/AccountDetails';

const RouterConfig = () => (

    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginsignup" element={<LoginSignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product-details/:id" element={<ProductDetail />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/account" element={<AccountDetails />} />
        <Route path="/login" element={<LoginSignUp />} />
    </Routes>

);

export default RouterConfig;
