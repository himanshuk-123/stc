import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { emitNetworkError } from './networkModal';

/**
 * Setup global axios interceptors for all axios instances
 * This ensures network errors are handled consistently across the app
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor - check network before making API calls
  axios.interceptors.request.use(
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

  // Response interceptor - handle network errors globally
  axios.interceptors.response.use(
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
};
