import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Ange en giltig e-postadress.');
      return;
    }

    // Visa bekräftelse direkt utan API-anrop
    setMessage(`Ett återställningsmail har skickats till ${email}.`);
    setEmail('');
  };

  return (
    <div className="auth-container">
      <h2>Glömt lösenord?</h2>

      {error && <div className="error-message" role="alert">{error}</div>}
      {message && <div className="success-message" role="alert">{message}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">E-postadress</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Ange din e-postadress"
            value={email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <button type="submit">Skicka återställningsmail</button>
      </form>

      <div className="auth-footer">
        <p>
          Kommer du ihåg ditt lösenord?{' '}
          <Link to="/" className="auth-link">Logga in här</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
