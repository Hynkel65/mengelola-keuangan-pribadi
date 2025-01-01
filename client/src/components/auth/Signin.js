import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Signin = () => {
  const { signin, error: contextError } = useContext(GlobalContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear error when form fields change
  useEffect(() => {
    setError('');
  }, [formData.username, formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username dan password harus diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const success = await signin(formData);
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Signin error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Terjadi kesalahan saat sign in';
        setError(errorMessage);
      } else if (error.request) {
        setError('Tidak dapat terhubung ke server. Silakan coba lagi.');
      } else {
        setError('Terjadi kesalahan saat sign in');
      }
    } finally {
      setIsSubmitting(false);
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
      {(error || contextError) && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          backgroundColor: '#ffebee',
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          color: '#c62828'
        }}>
          {error || contextError}
        </div>
      )}
      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{ opacity: isSubmitting ? 0.7 : 1 }}
      >
        {isSubmitting ? 'Memproses...' : 'Sign In'}
      </button>
    </form>
  );
};

export default Signin;