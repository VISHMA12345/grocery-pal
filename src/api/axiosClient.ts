import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://grocery-server-vbfz.onrender.com/api',
  //  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
