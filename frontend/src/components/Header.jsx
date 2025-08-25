import React, { useState } from 'react';
import '../css/Header.css';
import { FaShoppingBasket, FaSearch } from "react-icons/fa";
import { CiLight } from "react-icons/ci";
import { IoMoon } from "react-icons/io5";
import { useNavigate, Link } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawer, basketSlice } from '../redux/slices/basketSlice';
import { MdAdminPanelSettings } from "react-icons/md";

function Header() {
    const [theme, setTheme] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products } = useSelector((store) => store.basket);
    const user = localStorage.getItem('user') && localStorage.getItem('user') !== "undefined"
        ? JSON.parse(localStorage.getItem('user'))
        : null;

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
        <div className='h-header-container'>
            <div className='h-logo-section' onClick={() => navigate("/")}>
                <img className='h-logo' src='./src/images/logo.png' alt='logo' />
                <p className='h-logo-text'>Mağaza</p>
            </div>
            <div className='flex-row'>
                <form onSubmit={handleSearch} className='h-search-form'>
                    <div className='h-search-icon-container'>
                        <input
                            type='text'
                            className='h-search-input'
                            placeholder='Ürün Ara...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type='submit' className='h-search-button'>
                            <FaSearch />
                        </button>
                    </div>
                </form>
                <div className='h-icon-group' style={{ width: '100%' }}>

                    {theme ? (<CiLight className='h-icon' onClick={changeTheme} />) : (<IoMoon className='h-icon' onClick={changeTheme} />)}
                    <button
                        onClick={() => dispatch(basketSlice.actions.setDrawer(true))}
                        className="h-basket-icon-btn"
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            className="h-account-btn"
                            onClick={() => navigate('/account')}
                        >
                            Hesabım
                        </button>
                        {user.isAdmin && (
                            <button
                                className="h-admin-btn"
                                onClick={() => navigate('/admin/products')}
                            >
                                <MdAdminPanelSettings size={22} />
                                Admin
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        className="h-account-btn"
                        onClick={() => navigate('/login')}
                    >
                        Giriş Yap / Üye Ol
                    </button>
                )}
            </nav>
            {user && (
                <button
                    className='h-logout-btn'
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