import { NavLink } from "react-router-dom";

export default function Header() {
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
                </li>
                <li>
                    <NavLink to="/privacy" title="Privacy Policy" aria-label="Home Navigation Button">Privacy</NavLink>
                </li>
            </ul>
        </nav>
    </header>;
}