import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Signin = () => {
  // Access the signin function from the global context
  const { signin } = useContext(GlobalContext);

  // State to hold form data
  const [formData, setFormData] = useState({ username: '', password: '' });

  // State to hold error messages
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const success = await signin(formData); // Attempt to sign in with form data

    if (success) {
      // Reload the page on successful sign-in
      window.location.reload();
    } else {
      // Set error message if sign-in fails
      setError('Username or Password is not correct. Please Try Again');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        autoComplete="username"
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;