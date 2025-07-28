import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css'

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/chat', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="full-page-loader">
          <LoadingSpinner />
          <p>Laddar din session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="auth-box">
        <h2>Välkommen till Chatify-k!</h2>
        <p>
          Chatify är din plattform för enkel och säker kommunikation. Chatta med vänner, familj
          eller kollegor i realtid med vårt användarvänliga gränssnitt.
        </p>
        <p>
          Upplev funktioner som direktmeddelanden, gruppchattar och en smidig användarupplevelse.
          Gå med i Chatify idag och börja chatta!
        </p>
        <div className="button-group">
          <Link to="/login" aria-label="Logga in på Chatify">Logga in</Link>
          <Link to="/register" aria-label="Registrera dig på Chatify">Registrera dig</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
