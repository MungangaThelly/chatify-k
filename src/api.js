import axios from 'axios';
import { getToken } from './utils/auth.js'; 

const API_URL = 'https://chatify-api.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

const csrfApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getCsrfToken = async () => {
  const res = await csrfApi.patch('/csrf');
  return res.data;
};

// Auth
export const registerUser = async ({ username, password, email, avatar }) => {
  const { csrfToken } = await getCsrfToken();

  return axios.post(
    `${API_URL}/auth/register`,
    { username, password, email, avatar, csrfToken },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
};

export const loginUser = async ({ username, password }) => {
  const { csrfToken } = await getCsrfToken();

  return axios.post(
    `${API_URL}/auth/token`,
    { username, password, csrfToken },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
};



// Meddelanden
export const getMessages = () => api.get('/messages', { params});
export const createMessage = (msg) => api.post('/messages', msg);
export const deleteMessage = (msgId) => api.delete(`/messages/${msgId}`);

// Konversations
export const getConversations = () => api.get('/conversations');


// Användarna
export const getUsers = (params) => api.get('/users', { params });
export const getUser = (userId) => api.get(`/users/${userId}`);
export const updateUser = (data) => api.put('/user', data);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

export default api;