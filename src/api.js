import axios from 'axios';
import { getToken } from './utils/auth.js';

const API_URL = 'https://chatify-api.up.railway.app';

// Axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
});

// Add Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401 Unauthorized
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// CSRF instance
const csrfApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Get CSRF token
export const getCsrfToken = async () => {
  const res = await csrfApi.patch('/csrf');
  return res.data;
};

// 🔐 Auth
export const registerUser = async ({ username, password, email, avatar, csrfToken }) => {
  return api.post(
    '/auth/register',
    { username, password, email, avatar, csrfToken },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
};

export const loginUser = async ({ username, password, csrfToken }) => {
  return api.post(
    '/auth/token',
    { username, password, csrfToken },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
};

// 💬 Messages
export const getMessages = (params) => api.get('/messages', { params });
export const createMessage = (msg) => api.post('/messages', msg);
export const deleteMessage = (msgId) => api.delete(`/messages/${msgId}`);

// 💭 Conversations 
export const getConversations = () => api.get('/conversations');

// 👤 Users
export const getUsers = (params) => api.get('/users', { params });
export const getUser = (userId) => api.get(`/users/${userId}`);
export const updateUser = (data) => api.put('/user', data);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

export default api;
