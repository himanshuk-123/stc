import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

let networkListeners = [];

/**
 * Check if device has internet connection
 * @returns {Promise<boolean>} - true if connected, false otherwise
 */
export const checkNetworkConnectivity = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

/**
 * Subscribe to network state changes
 * @param {Function} callback - callback function to execute on network state change
 * @returns {Function} - unsubscribe function
 */
export const subscribeToNetworkStatus = (callback) => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    const isConnected = state.isConnected && state.isInternetReachable;
    console.log('Network status changed:', {
      isConnected,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
    });
    callback(isConnected);
  });

  networkListeners.push(unsubscribe);
  return unsubscribe;
};

/**
 * Unsubscribe all network listeners
 */
export const unsubscribeAllNetworkListeners = () => {
  networkListeners.forEach((unsubscribe) => unsubscribe());
  networkListeners = [];
};

/**
 * Show network error toast message
 * @param {string} errorMessage - custom error message to display
 */
export const showNetworkErrorToast = (errorMessage = null) => {
  const message = errorMessage || 'Please check your network and try again';

  Toast.show({
    type: 'error',
    text1: 'No Internet Connection',
    text2: message,
    position: 'bottom',
    visibilityTime: 3000,
  });
};

/**
 * Wrapper for API calls with network check
 * @param {Function} apiCall - the API call function to execute
 * @returns {Promise} - API response or error
 */
export const withNetworkCheck = async (apiCall) => {
  try {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
      showNetworkErrorToast('No internet connection');
      throw new Error('NO_NETWORK');
    }

    return await apiCall();
  } catch (error) {
    if (error.message === 'NO_NETWORK') {
      throw error;
    }

    // Check if it's a network error
    if (
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error' ||
      error.message?.includes('Network') ||
      !error.response
    ) {
      showNetworkErrorToast('Network error. Please check your connection.');
      throw new Error('NETWORK_ERROR');
    }

    throw error;
  }
};

export default {
  checkNetworkConnectivity,
  subscribeToNetworkStatus,
  unsubscribeAllNetworkListeners,
  showNetworkErrorToast,
  withNetworkCheck,
};
