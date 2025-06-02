// hämta en autentiseringstoken

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (token) return token;

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || null;
  } catch {
    return null;
  }
};
