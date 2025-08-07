import React, { useState } from 'react';
import '../css/Header.css';
import { FaShoppingBasket } from "react-icons/fa";
import { CiLight } from "react-icons/ci";
import { IoMoon } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import { setDrawer } from '../redux/slices/basketSlice';
import { MdAccountCircle } from "react-icons/md";



function Header() {
    const [theme, setTheme] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { products } = useSelector((store) => store.basket);

    const changeTheme = () => {
        const root = document.getElementById("root");
        if (theme) {
            root.style.backgroundColor = "#666";
            root.style.color = "#fff";
        }
        else {
            root.style.backgroundColor = "#fff";
            root.style.color = "#000";
        }
        setTheme(!theme)

    }
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className='flex-row' onClick={() => navigate("/")}>
                <img className='logo' src=".src/images/logo.png" />
                <p className='logo-text'>Site İsim</p>
            </div>
            <div className='flex-row'>
                <input className='search-input' placeholder='Ara' type='text' />
                <div>

                    {theme ? <CiLight className='icon' onClick={changeTheme} /> : <IoMoon className='icon' onClick={changeTheme} />}
                    <Badge onClick={() => dispatch(setDrawer())} badgeContent={products.length} color="error">
                        <FaShoppingBasket className='icon' />
                    </Badge>
                    <MdAccountCircle className='icon' style={{ fontSize: '30px' }} />

                </div>
            </div>
        </div>
    )
}

export default Header