import EmailEntry from "./EmailEntry";
import { NavLink } from "react-router-dom";

import '../styles/Footer/footer.css';


export default function Footer() {
    return <footer>

        <EmailEntry />
        
        <div className="bottom w-100 flex">
            <p>&copy; store.ihawp.com {new Date().getFullYear()}.</p>
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