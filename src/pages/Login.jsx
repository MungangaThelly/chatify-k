import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getCsrfToken } from '../api';
import './Login.css';

const Login = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setFormLoading(true);

  try {
    const { csrfToken } = await getCsrfToken();

    const res = await login({ 
      username: formData.username, 
      password: formData.password, 
      csrfToken 
    });

    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Inloggning misslyckades.');
    }
  } catch {
    setError('Ett fel inträffade vid inloggning.');
  }

  setFormLoading(false);
};


  useEffect(() => {
    if (!loading && user) {
      navigate('/chat', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Logga in</h2>
      </div>

      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Användarnamn</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Ange ditt användarnamn"
            required
            onChange={handleChange}
            value={formData.username}
            autoComplete="username"
            disabled={formLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Lösenord</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ange ditt lösenord"
              required
              onChange={handleChange}
              value={formData.password}
              autoComplete="current-password"
              disabled={formLoading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={formLoading}
          aria-busy={formLoading}
        >
          {formLoading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              <span>Loggar in ...</span>
            </>
          ) : (
            'Logga in och låt oss chatta!'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Har du inget konto?{' '}
          <Link to="/register" className="auth-link">
            Registrera dig här
          </Link>
        </p>
        <p>
          <Link to="/forgot-password" className="auth-link">
            Glömt ditt lösenord?
          </Link>
        </p>
      <button onClick={() => navigate('/')} className="back-button">
        ⬅ Till startsidan
      </button>
      </div>
    </div>
  );
};

export default Login;
