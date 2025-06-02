import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, registerUser, getUser } from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized token validation
  const validateToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (!decoded.exp || decoded.exp <= now) {
        throw new Error('Token expired');
      }

      return decoded;
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }, []);

  // Load user from token/localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        const decoded = validateToken(token);

        if (decoded) {
          try {
            const res = await getUser(decoded.id);
            const userData = Array.isArray(res.data) ? res.data[0] : res.data;

            setUser(userData);
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
          } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } else {
        const storedUser = localStorage.getItem(USER_KEY);
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
      if (!decoded) throw new Error('Invalid token received');

      localStorage.setItem(TOKEN_KEY, res.data.token);

      const userRes = await getUser(decoded.id);
      const userData = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;

      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };


  // Register function
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

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    validateToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
