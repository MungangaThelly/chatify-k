import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser, deleteUser } from '../api';
import SideNav from '../components/SideNav';
import './Profile.css';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialisera form data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'avatar') {
      setAvatarPreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedUser = await updateUser(user.id, formData);
      setUser(updatedUser.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. ' +
      'All your data will be permanently removed.'
    )) return;

    try {
      setLoading(true);
      await deleteUser(user.id);
      logout();
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <SideNav activeItem="profile" />

      <div className="profile-content">
        <h1>Profile Settings</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="profile-section">
          <div className="avatar-preview">
            <img 
              src={avatarPreview || 'https://i.pravatar.cc/200'} 
              alt="Avatar Preview"
              onError={(e) => {
                e.target.src = 'https://i.pravatar.cc/200';
              }}
            />
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          )}
        </div>

        <div className="danger-zone">
          <h2>Danger Zone</h2>
          <button 
            className="delete-btn"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete My Account'}
          </button>
          <p className="warning-text">
            This will permanently delete your account and all associated data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;