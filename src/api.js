import axios from 'axios';

const API_URL = 'https://chatify-api.up.railway.app';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  // Removed `withCredentials` since we’re using tokens now
});

// Add interceptor to attach Authorization header to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);



// Authentication
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/token', data);

// Messages
export const getMessages = () => api.get('/messages');
export const createMessage = (msg) => api.post('/messages', msg);
export const deleteMessage = (msgId) => api.delete(`/messages/${msgId}`);

// Users
export const getUsers = (params) => api.get('/users', { params });
export const getUser = (userId) => api.get(`/users/${userId}`);
export const updateUser = (data) => api.put('/user', data);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

export default api;
