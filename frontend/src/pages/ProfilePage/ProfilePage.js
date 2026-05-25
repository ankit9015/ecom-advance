import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(user.id);
      setProfileData(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.updateProfile(user.id, profileData);
      setProfileData(response.data.data);
      setSuccess('Profile updated successfully');
      setEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (authLoading || loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-container">
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={profileData?.email} disabled />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={profileData?.first_name || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={profileData?.last_name || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={profileData?.phone || ''}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={profileData?.address || ''}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={profileData?.city || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={profileData?.state || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                name="zip_code"
                value={profileData?.zip_code || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={profileData?.country || ''}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="form-actions">
            {!editing ? (
              <button type="button" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
