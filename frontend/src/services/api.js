import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventsAPI = axios.create({
  baseURL: `${BASE_URL}/events`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingsAPI = axios.create({
  baseURL: `${BASE_URL}/bookings`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleResponseError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

[authAPI, eventsAPI, bookingsAPI].forEach(api => {
  api.interceptors.request.use(addAuthToken);
  api.interceptors.response.use(
    response => response,
    handleResponseError
  );
});