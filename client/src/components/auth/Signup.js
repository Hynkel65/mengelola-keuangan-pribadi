import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';

const Signup = () => {
  const { signup, error: contextError } = useContext(GlobalContext);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear error when form fields change
  useEffect(() => {
    setError('');
  }, [formData.username, formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('Semua field harus diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password harus 6 karakter atau lebih');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const success = await signup(formData);
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.log('Error response:', error.response);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Terjadi kesalahan saat sign up';
        setError(errorMessage);
      } else if (error.request) {
        setError('Tidak dapat terhubung ke server. Silakan coba lagi.');
      } else {
        setError('Terjadi kesalahan saat sign up');
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
        {isSubmitting ? 'Memproses...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Signup;