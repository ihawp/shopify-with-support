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
    <div className='flex justify-center w-100'>
      <div className='flex-col email-list'>
        <h2>Join Our Mailing List!</h2>
          <form onSubmit={emailSubmit} className="max-w-3" id="email-form">
          <label htmlFor="email-input">Input Your Email:</label>
          {message ? null : 
          <span>
                      <input
            id="email-input"
            type="email"
            className="max-w-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>          
            <span className="send-text">
              Join
            </span>
          </button>
          </span>}
          <p className="alert">{message && `${message}`}</p>
        </form>
      </div>
    </div>
  );
}
