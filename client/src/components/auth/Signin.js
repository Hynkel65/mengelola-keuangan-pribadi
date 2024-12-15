import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Signin = () => {
  const { signin } = useContext(GlobalContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting sign-in form with data:', formData); // Log the form data
    const success = await signin(formData);
    console.log('Sign-in success:', success); // Log the success status
    if (success) {
      window.location.reload();
      console.log('Navigating to main app...'); // Log navigation action
    } else {
      setError('Username or Password is not correct. Please Try Again');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id='username'
        name="username"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        autoComplete='username'
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id='password'
        name="password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;