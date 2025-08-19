import React, { useState } from 'react';
import '../css/Header.css';
import { FaShoppingBasket, FaSearch } from "react-icons/fa";
import { CiLight } from "react-icons/ci";
import { IoMoon } from "react-icons/io5";
import { useNavigate, Link } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawer, basketSlice } from '../redux/slices/basketSlice';
import { MdAccountCircle } from "react-icons/md";

function Header() {
    const [theme, setTheme] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products } = useSelector((store) => store.basket);
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const changeTheme = () => {
        document.body.classList.toggle('dark-mode');
        setTheme(!theme);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className='header-container'>
            <div className='logo-section' onClick={() => navigate("/")}>
                <img className='logo' src='./src/images/logo.png' alt='logo' />
                <p className='logo-text'>Mağaza</p>
            </div>
            <div className='flex-row'>
                <form onSubmit={handleSearch} className='search-form'>
                    <div className='search-icon-container'>
                        <input
                            type='text'
                            className='search-input'
                            placeholder='Ürün Ara...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type='submit' className='search-button'>
                            <FaSearch />
                        </button>
                    </div>
                </form>
                <div className='icon-group' style={{ width: '100%' }}>

                    {theme ? (<CiLight className='icon' onClick={changeTheme} />) : (<IoMoon className='icon' onClick={changeTheme} />)}
                    <button
                        onClick={() => dispatch(basketSlice.actions.setDrawer(true))}
                        className="basket-icon-btn"
                        aria-label="Sepetim"
                        style={{ background: 'none', border: 'none', padding: 0 }}
                    >
                        <Badge badgeContent={products.length} color="error">
                            <FaShoppingBasket size={24} />
                        </Badge>
                    </button>
                </div>
            </div>
            <nav>
                {user ? (
                    <button
                        className="account-btn"
                        onClick={() => navigate('/account')}
                    >
                        Hesabım
                    </button>
                ) : (
                    <button
                        className="account-btn"
                        onClick={() => navigate('/login')}
                    >
                        Giriş Yap / Üye Ol
                    </button>
                )}
            </nav>
            {user && (
                <button
                    className='logout-btn'
                    onClick={() => {
                        localStorage.removeItem('user');
                        fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                        window.location.reload();
                    }}
                >
                    Çıkış Yap
                </button>
            )}
        </div>
    )
}

export default Header