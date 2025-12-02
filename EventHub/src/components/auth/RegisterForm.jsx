import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { User, Mail, Lock, Phone, MapPin, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'ROLE_PARTICIPANT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 5) {
      setError('Password must be at least 5 characters');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone must be 10 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      registerData.phone = parseInt(registerData.phone);
      
      await authApi.register(registerData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form register-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <span>{success}</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">
            <User size={18} />
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="emailId">
          <Mail size={18} />
          Email
        </label>
        <input
          type="email"
          id="emailId"
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phone">
          <Phone size={18} />
          Phone (10 digits)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          maxLength="10"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">
          <MapPin size={18} />
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Register as</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="ROLE_PARTICIPANT">Participant</option>
          <option value="ROLE_MANAGER">Event Manager</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? <LoadingSpinner size="small" message="" /> : 'Register'}
      </button>

      <p className="auth-footer">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </form>
  );
};

export default RegisterForm;