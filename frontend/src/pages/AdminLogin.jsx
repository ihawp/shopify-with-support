import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ServerURL from '../middleware/ServerURL';

import '../styles/Login/login.css';

export default function AdminLogin() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Function to handle the API call
    const makeFetch = async () => {
        setLoading(true);
        setError(null); // Reset any previous errors

        try {
            let response = await fetch(ServerURL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            let responseData = await response.json();

            if (responseData) {
                setLoading(false);
                navigate('/support');
                window.location.reload();
            } else {
                setError('No token received');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data) {
            makeFetch();
        }
    }, [data]);

    const formSubmit = (event) => {
        event.preventDefault();

        let username = event.target[0].value;
        let password = event.target[1].value;

        setData({ username, password });
    };

    return (
        <main id="login" className='flex flex-col items-center gap-1 mt-1'>
            <header className='text-center'>
                <h1>Login</h1>
            </header>
            <section>
                <form onSubmit={formSubmit} className='flex flex-col items-center gap-0-5'>
                    <label for="username">Enter Your Username:</label>
                    <input className="py-1 px-0-5" id="username" type="text" placeholder="Username" required />
                    <label for="password">Enter Your Password:</label>
                    <input className="py-1 px-0-5" id="password" type="password" placeholder="Password" required />
                    <input className="py-1 px-0-5" type="submit" value="Login" />
                </form>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </section>
        </main>
    );
}
