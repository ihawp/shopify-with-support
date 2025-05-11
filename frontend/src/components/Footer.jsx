import EmailEntry from "./EmailEntry";
import { NavLink } from "react-router-dom";

import '../styles/Footer/footer.css';
import Logo from "./Logo";


export default function Footer() {
    return <footer>

        <EmailEntry />

        <div className="bottom w-100 flex">
            <div className="flex flex-row items-center gap-0-5 logo footer">
            <NavLink to='/'>
                        <Logo />
                    </NavLink>
                    <span>store.ihawp.com {new Date().getFullYear()}</span>
            </div>
            <nav>
                <ul className="gap-1">
                    <li>
                        <NavLink to="/" title="Home">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/support" title="Support">Support</NavLink>
                    </li>
                    <li>
                        <NavLink to="/cart" title="Cart">Cart</NavLink>
                    </li>
                    <li>
                        <NavLink to="/privacy">Privacy Policy</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    </footer>;
}