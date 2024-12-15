import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Signup = () => {
  const { signup } = useContext(GlobalContext);

  // State to store form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  // State to store error messages
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Attempt to sign up
    const success = await signup(formData);
    if (success) {
      alert('Sign up successful! Please login with your credentials.');
      window.location.reload();
    } else {
      setError('Username is already taken');
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
        maxLength="30"
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      />

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;