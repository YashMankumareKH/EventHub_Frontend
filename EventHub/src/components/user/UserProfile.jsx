import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userApi.getUserProfile(user.id);
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await userApi.updateUserProfile(user.id, profile);
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>My Profile</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn btn-secondary">
            Edit Profile
          </button>
        )}
      </div>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>
              <User size={18} />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              disabled={!editing}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <Mail size={18} />
            Email
          </label>
          <input
            type="email"
            name="emailId"
            value={profile.emailId}
            onChange={handleChange}
            disabled
            required
          />
        </div>

        <div className="form-group">
          <label>
            <Phone size={18} />
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <MapPin size={18} />
            Address
          </label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!editing}
            rows="3"
            required
          />
        </div>

        {editing && (
          <div className="form-group">
            <label>
              <Lock size={18} />
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={profile.password || ''}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
        )}

        {editing && (
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => {
                setEditing(false);
                fetchProfile();
              }} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <LoadingSpinner size="small" /> : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;