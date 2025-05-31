import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, deleteUser } from '../api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const updated = await updateProfile(formData);
      setUser(updated.data);
      alert('Profilen uppdaterad!');
    } catch (err) {
      console.error('Kunde inte uppdatera profil:', err);
      alert('Ett fel uppstod vid uppdatering.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Är du säker på att du vill radera ditt konto?');
    if (!confirmed) return;

    try {
      await deleteUser();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Kunde inte radera konto:', err);
      alert('Kunde inte radera kontot.');
    }
  };

  return (
    <div className="profile-container">
      <h2>Min Profil</h2>

      <form onSubmit={handleSave} className="profile-form">
        <label>Användarnamn</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>E-post</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Byt avatar</label>
        <input type="file" accept="image/*" onChange={handleAvatarChange} />

        {avatarUrl && (
          <div className="avatar-preview">
            <img src={avatarUrl} alt="Avatar Preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Sparar...' : 'Spara ändringar'}
        </button>
      </form>

      <button className="delete-btn" onClick={handleDeleteAccount}>
        🗑️ Radera konto
      </button>
    </div>
  );
};

export default Profile;
