import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Signup = () => {
  const { signup } = useContext(GlobalContext);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords tidak sama');
      return;
    }

    const success = await signup(formData);
    if (success) {
      alert('Sign up berhasil');
      window.location.reload();
    } else {
      setError('Username sudah digunakan');
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