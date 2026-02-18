import axios from 'axios'
import Toast from 'react-native-toast-message'
import NetInfo from '@react-native-community/netinfo'

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
      Toast.show({
        type: 'error',
        text1: 'No Internet Connection',
        text2: 'Please check your network and try again',
        position: 'bottom',
        visibilityTime: 3000,
      });
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
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'Unable to reach server. Please check your connection.',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    }
    // Handle timeout errors
    else if (error.code === 'ECONNABORTED') {
      Toast.show({
        type: 'error',
        text1: 'Request Timeout',
        text2: 'The request took too long. Please try again.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;