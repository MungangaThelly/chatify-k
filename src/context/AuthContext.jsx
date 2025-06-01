import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, registerUser, getUser } from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized function to check token validity
  const validateToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      
      if (!decoded.exp || decoded.exp <= now) {
        throw new Error('Token expired');
      }
      
      return decoded;
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  }, []);

  useEffect(() => {
  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decoded = validateToken(token);
      if (decoded) {
        try {
          const res = await getUser(decoded.id);
          if (Array.isArray(res.data)) {
            setUser(res.data[0]);
            localStorage.setItem('user', JSON.stringify(res.data[0]));
          } else {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch {
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } else {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
    setLoading(false);
  };

  initializeAuth();
}, [validateToken]);


  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await loginUser(credentials);
      const decoded = validateToken(res.data.token);
      
      if (!decoded) {
        throw new Error('Invalid token received');
      }

      const userData = {
        id: decoded.id,
        username: decoded.username,
        avatar: decoded.avatar || 'https://i.pravatar.cc/200',
      };

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      await registerUser(data);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  // Add setUser to context value for SideNav
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    setUser, // Added for SideNav compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};