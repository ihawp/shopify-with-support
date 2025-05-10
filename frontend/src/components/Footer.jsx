import EmailEntry from "./EmailEntry";

import { Link } from "react-router-dom";

import '../styles/Footer/footer.css';


export default function Footer() {
    return <footer>
        <EmailEntry />
        <nav>
            <ul>
                <li>
                    <a href="" title="">Shop</a>
                </li>
                <li>
                    <a href="" title="">Support</a>
                </li>
                <li>
                    <a href="" title="">Cart</a>
                </li>
                <li>
                    <a href="" title="">Privacy</a>
                </li>
            </ul>
            <ul>
                <li>
                    <a href="" title=""></a>
                </li>
                <li>
                    <a href="" title=""></a>
                </li>
                <li>
                    <a href="" title=""></a>
                </li>
            </ul>
        </nav>
        <div className="bottom w-100 flex">
            <p>&copy; ihawp 2025.</p>
            <Link to="/privacy">Privacy Policy</Link>
        </div>
    </footer>;
}