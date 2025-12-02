import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

const handleFocus = () => {
    setError('');
  };



  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // authApi.login now returns the entire response object
      const response = await authApi.login(formData);

      // Extract data from the response object
      login(response.data); // <<<--- FIX IS CONFIRMED HERE
      console.log(response.data);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err); // Log the error to debug the synchronous crash

      const msg =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.';

      setError(msg);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login to EventHub</h2>

      {error && (
        <div className="error-message" role="alert" style={{ position: 'relative' }}>
          <AlertCircle size={18} style={{ verticalAlign: 'middle' }} />
          <span style={{ marginLeft: 8 }}>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            aria-label="Close error"
            style={{
              position: 'absolute',
              right: 8,
              top: 6,
              border: 'none',
              background: 'transparent',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">
          <Mail size={18} />
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="your.email@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          <Lock size={18} />
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? <LoadingSpinner size="small" message="" /> : 'Login'}
      </button>

      <p className="auth-footer">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </form>
  );
};

export default LoginForm;
