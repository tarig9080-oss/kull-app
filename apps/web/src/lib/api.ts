import axios from 'axios';

// في التطوير: proxy من vite.config.ts  (/api → localhost:3001)
// في الإنتاج: VITE_API_URL من متغيرات Vercel
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({ baseURL, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kull_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('kull_token');
      localStorage.removeItem('kull_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;
