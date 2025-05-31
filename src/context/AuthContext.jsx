import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      const decoded = jwtDecode(res.data.token);
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
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Login failed';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (data) => {
    try {
      await registerUser(data);
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
