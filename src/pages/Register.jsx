import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const res = await register(formData);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      // Visa exakt felmeddelande från API, t.ex. "Username or email already exists"
      setError(res.error || 'Registreringen misslyckades.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Registrera dig</h2>

      {error && <p className="error">⚠️ {error}</p>}
      {success && <p className="success">✅ Registrering lyckades! Du skickas till inloggningen...</p>}

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
