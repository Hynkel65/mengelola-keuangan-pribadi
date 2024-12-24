import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Signin = () => {
  const { signin } = useContext(GlobalContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signin(formData);

    if (success) {
      window.location.reload();
    } else {
      setError('Username atau Password salah! Coba Lagi');
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;