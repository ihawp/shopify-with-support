import { useState } from 'react';
import ServerURL from '../middleware/ServerURL';

export default function EmailEntry() {


  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const emailSubmit = async (event) => {

    if (message) return;

    event.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email format.');
      return;
    }
  
    try {
      const res = await fetch(ServerURL + '/create-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (!res.ok) {
        return setMessage('Something went wrong please try again.');
      }

      const data = await res.json();
  
      if (data) {
        if (data?.userErrors) {
            console.log(data.userErrors);
            setMessage(data.userErrors);
            return;
        }
        setMessage('Thank you! You have been subscribed.');
        setEmail('');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section>
        <form onSubmit={emailSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Subscribe</button>
      </form>
        {message && <p>{message}</p>}
    </section>
  );
}
