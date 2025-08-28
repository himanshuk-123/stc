import axios from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS, API_TIMEOUT } from '../constants/api';

/**
 * Configured axios instance for API requests
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: API_TIMEOUT,
});

/**
 * Request interceptor
 * - Add authorization token
 * - Add additional headers
 */
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = getToken();
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handle common error responses
 * - Transform response data if needed
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (timeouts, network errors, etc.)
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API No Response:', error.request);
    } else {
      // Error in setting up the request
      console.error('API Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;