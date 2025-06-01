import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Token from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Profile from './pages/Profile'

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/token"
          element={!user ? <Token /> : <Navigate to="/chat" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/chat" replace />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/token" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/token" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/chat" : "/token"} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
