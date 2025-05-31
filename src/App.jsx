import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Footer from './components/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/chat" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/chat" replace />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/chat" : "/login"} replace />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
