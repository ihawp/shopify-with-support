import { NavLink } from "react-router-dom";

import SearchBar from "../components/SearchBar";

import { useContext, useState, useEffect } from 'react';

import { SocketContext } from "../middleware/SocketProvider";

import { CartContext } from "../middleware/CartProvider";

import '../styles/Header/header.css';

export default function Header() {

    const { users } = useContext(SocketContext);

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
                <button className="none-sm flex items-center justify-center" onClick={changeNav}>
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
                        <NavLink to="/cart" title="Cart" aria-label="Cart Navigation Button">Cart</NavLink>
                    </li>
                    <li>
                        <NavLink to="/privacy" title="Privacy Policy" aria-label="Privacy Policy Navigation Button">Privacy</NavLink>
                    </li>
                </ul>
            </nav>
            <nav id="cart-navigation" aria-label="Cart Navigation" className="flex flex-row justify-end items-center w-50-sm-unset gap-1">
                <NavLink to="/cart" aria-label="Home Navigation Button" className="flex flex-row items-center gap-0-5 cart" title={`Cart: ${cartItems.length} Items`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                    {cartItems.length > 0 ? <span>{cartItems.length}</span> : null}
                </NavLink>
                <div className="flex flex-row items-center gap-0-5" title={`Live Shoppers Count: ${users}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
                    <span>{users}</span>
                </div>
            </nav>
            <SearchBar />
        </header>;
}