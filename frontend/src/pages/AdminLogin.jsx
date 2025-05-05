import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

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
            let response = await fetch('http://localhost:3000/login', {
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
        <main>
            <header>
                <h1>Admin Login</h1>
            </header>
            <section>
                <form onSubmit={formSubmit}>
                    <input type="text" placeholder="Username" required />
                    <input type="password" placeholder="Password" required />
                    <input type="submit" value="Login" />
                </form>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </section>
        </main>
    );
}
