import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/chat', { replace: true });
    } else {
      // Visa specifikt felmeddelande från API:t, t.ex. "Invalid credentials"
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Logga in</h2>

      {error && <p className="error">⚠️ {error}</p>}

      <form onSubmit={handleSubmit} autoComplete="on">
        <input
          id="username"
          name="username"
          placeholder="Användarnamn"
          required
          onChange={handleChange}
          value={formData.username}
          autoComplete="username"
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Lösenord"
          required
          onChange={handleChange}
          value={formData.password}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loggar in...' : 'Logga in'}
        </button>
      </form>

      <div className="auth-footer">
        Har du inget konto? <Link to="/register">Registrera dig här</Link>
      </div>
    </div>
  );
};

export default Login;
