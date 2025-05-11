import { NavLink } from "react-router-dom";

import SearchBar from "../components/SearchBar";

import Logo from "./Logo";

import { useContext, useState, useEffect } from 'react';

import { CartContext } from "../middleware/CartProvider";

import '../styles/Header/header.css';

export default function Header() {

    const { cartItems } = useContext(CartContext);

    const [navState, setNavState] = useState(false);

    const changeNav = () => {
        return setNavState(prev => !prev);
    }

    useEffect(() => {
        const handleResize = () => {
            setNavState(window.innerWidth > 800);
        };
    
        handleResize();
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <header id="header">
            <nav id="main-navigation" aria-label="Main Navigation" className="w-50-sm-unset">
                <button id={`${navState ? 'close-nav' : 'open-nav'}`} aria-label="Mobile Navigation Button" className="navigation-button none-sm flex items-center justify-center py-1 px-0-5 gap-0-5" onClick={changeNav}>
                    <Logo />
                    <span>|</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                </button>
                <ul id="anchor-list" className={` ${navState ? 'open' : null}`}>
                    <li>
                        <NavLink to="/" title="Shop" aria-label="Shop Navigation Button">Shop</NavLink>
                    </li>
                    <li>
                        <NavLink to="/support" title="Support" aria-label="Support Navigation Button">Support</NavLink>
                    </li>
                    <li>
                        <NavLink to="/privacy" title="Privacy Policy" aria-label="Privacy Policy Navigation Button">Privacy</NavLink>
                    </li>
                </ul>
            </nav>
            <nav id="cart-navigation" aria-label="Cart Navigation" className="flex flex-row justify-end items-center w-50-sm-unset gap-1">
                <NavLink to="/cart" aria-label="Cart Navigation Button" className="flex flex-row items-center gap-0-5 cart" title={`Cart: ${cartItems.length} Items`}>
                    <button className="cart-button py-1 px-0-5 flex flex-row items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                        {cartItems.length > 0 ? <span>{cartItems.length}</span> : null}
                    </button>
                </NavLink>
            </nav>
            <NavLink to={'/'} id="logo" className="display-sm">
                <Logo />
            </NavLink>
            <div className="none-sm w-100">
                <SearchBar />
            </div>
        </header>;
}