import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 600000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  generateCalendar: async (data) => {
    const response = await api.post('/generate/week', data);
    return response.data;
  },
  downloadExcel: async (sessionId) => {
    const response = await api.get(`/download/${sessionId}`, { responseType: 'blob' });
    return response.data;
  },
};

export default api;
