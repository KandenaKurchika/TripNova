import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends the httpOnly JWT cookie
});

// Also attach bearer token if present (useful for mobile/webviews without cookies)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tripnova_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tripnova_token');
    }
    return Promise.reject(err);
  }
);

export default api;
