import { useContext } from 'react';
import { AuthContext } from './AuthContextInstance';

// hook för åtkomst till auth-kontext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
