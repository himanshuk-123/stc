import axios from 'axios'
import NetInfo from '@react-native-community/netinfo'
import { emitNetworkError } from '../utils/networkModal'

const BASE_URL = 'https://onlinerechargeservice.in/App/webservice'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to check network before making API calls
api.interceptors.request.use(
  async (config) => {
    // Check network connectivity before making request
    const netState = await NetInfo.fetch();
    
    if (!netState.isConnected || !netState.isInternetReachable) {
      emitNetworkError('Please check your network and try again');
      // Cancel the request
      return Promise.reject({ 
        isNetworkError: true, 
        message: 'No internet connection' 
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle network errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle network errors
    if (
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error' ||
      error.message?.includes('Network') ||
      !error.response
    ) {
      // Check if it's not already handled by request interceptor
      if (!error.isNetworkError) {
        emitNetworkError('Unable to reach server. Please check your connection.');
      }
    }
    // Handle timeout errors
    else if (error.code === 'ECONNABORTED') {
      emitNetworkError('The request took too long. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api;