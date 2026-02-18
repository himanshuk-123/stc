import axios from 'axios';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'https://onlinerechargeservice.in/App/webservice'; // replace with your base URL
export const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
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

const ApiService = {
  login: (Name, Pass, Version, IMEI, FireToken,Location) =>
    api.post('/Login', {
      Name, Pass, Version, IMEI, FireToken,Location
    }),
  changePassword: (TokenID,Password,OldPassword,Version) =>
    api.post('/ChangePass', {
      TokenID,Password,OldPassword,Version
    }),

  otpVerify: (MobileNo, Version, IMEI, OTP) =>
    api.post('/OTPVerify', {
      MobileNo, Version, IMEI, OTP
    }),

  resendOTP: (Mobileno,Version,IP,Location) =>
    api.post('/ResendOTP',{
      Mobileno,Version,IP,Location
    } ),

  forgetPassword: (UserName,OTP, Password, Version, IP, Location) =>
    api.post('/ForgetPass', {
      UserName, OTP, Password, Version, IP, Location
    }),
    changePin:(TokenID,OldPin,NewPin,Version) => 
      api.post('/ChangePin',{
        TokenID,OldPin,NewPin,Version
      }),
    
    slider: () =>
        api.get('/SilderList')
    
};

export default ApiService;