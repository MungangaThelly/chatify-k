import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import ForgotPassword from './components/ForgotPassword';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-page-loader">
        <LoadingSpinner />
        <p>Loading your session...</p>
      </div>
    );
  }

  // Protect routes here directly
  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ element }) => {
    return !user ? element : <Navigate to="/chat" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

        <Route path="/" element={<Navigate to={user ? '/chat' : '/login'} replace />} />
        <Route path="*" element={<Navigate to={user ? '/chat' : '/login'} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
