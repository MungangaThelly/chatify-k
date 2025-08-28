import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Välkommen till Chatify-k';
  }, []);

  // Omdirigera authenticerad användaren 
  useEffect(() => {
    if (!loading && user) {
      navigate('/chat', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="full-page-loader">
          <LoadingSpinner />
          <p>Laddar din session...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="home-container">
      <section className="auth-box" aria-labelledby="welcome-heading">
        <h1 id="welcome-heading">Välkommen till Chatify-k!</h1>
        <p>
          Chatify är din plattform för enkel och säker kommunikation. Chatta med vänner, familj
          eller kollegor i realtid med vårt användarvänliga gränssnitt.
        </p>
        <p>
          Upplev funktioner som direktmeddelanden, gruppchattar och en smidig användarupplevelse.
          Gå med i Chatify idag och börja chatta!
        </p>
        <div className="button-group">
          <Link to="/login" className="primary-button" aria-label="Logga in på Chatify">
            Logga in
          </Link>
          <Link to="/register" className="secondary-button" aria-label="Registrera dig på Chatify">
            Registrera dig
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
