import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../api';

const Toast = ({ message }) => {
  return (
    <div className="toast">
      {message}
    </div>
  );
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    avatar: 'https://i.pravatar.cc/200'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);       
  const [toastMessage, setToastMessage] = useState('');    

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { csrfToken } = await getCsrfToken();
      const res = await register({ ...formData, csrfToken });

      if (res.success) {
        setToastMessage('User registered successfully');  
        setShowToast(true);                                
        setSuccess(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/login');                              // Omdirigera efter 2 seconds
        }, 2000);
      } else {
        setError(res.error || 'Registreringen misslyckades.');
      }
    } catch (err) {
      console.error('Registreringsfel:', err);
      setError('Ett oväntat fel inträffade.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Registrera dig</h2>

      {error && <p className="error">⚠️ {error}</p>}
      {success && <p className="success">✅ Registrering lyckades! Du skickas till inloggningen...</p>}

      {showToast && <Toast message={toastMessage} />}

      <form onSubmit={handleSubmit} autoComplete="on">
        <input
          id="username"
          name="username"
          placeholder="Användarnamn"
          required
          onChange={handleChange}
          value={formData.username}
          autoComplete="username"
          disabled={loading}
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Lösenord"
          required
          onChange={handleChange}
          value={formData.password}
          autoComplete="new-password"
          disabled={loading}
        />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="E-post"
          required
          onChange={handleChange}
          value={formData.email}
          autoComplete="email"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrerar...' : 'Registrera'}
        </button>
      </form>

      <div className="auth-footer">
        Har du redan ett konto? <Link to="/login">Logga in här</Link>
      </div>
      <button onClick={() => navigate('/')} className="back-button">
        ⬅ Till startsidan
      </button>
    </div>
  );
};

export default Register;
