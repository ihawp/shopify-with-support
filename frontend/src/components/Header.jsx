import { NavLink } from "react-router-dom";

import SearchBar from "../components/SearchBar";

import { useContext } from 'react';

import { SocketContext } from "../middleware/SocketProvider";

import { CartContext } from "../middleware/CartProvider";

export default function Header() {

    const { users } = useContext(SocketContext);

    const { cartItems } = useContext(CartContext);

    return <header>
        <nav>
            <ul>
                <li>
                    <NavLink to="/" title="Home" aria-label="Home Navigation Button">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/support" title="Support" aria-label="Home Navigation Button">Support</NavLink>
                </li>
                <li>
                    <NavLink to="/cart" title="Cart" aria-label="Home Navigation Button">Cart</NavLink>
                    <span>{cartItems.length || null}</span>
                </li>
                <li>
                    <NavLink to="/privacy" title="Privacy Policy" aria-label="Home Navigation Button">Privacy</NavLink>
                </li>
            </ul>
        </nav>
        <div>
            <span>Shoppers Online:</span>
            <span>{users}</span>
        </div>
        <SearchBar />
    </header>;
}