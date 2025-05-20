import axios from 'axios';

const BASE_URL = 'https://onlinerechargeservice.in/App/webservice'; // replace with your base URL
export const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

const ApiService = {
  login: (Name, Pass, Version, IMEI, FireToken,Location) =>
    api.post('/Login', {
      Name, Pass, Version, IMEI, FireToken,Location
    }),
  changePassword: (oldPassword,newPassword,confirmPassword) =>
    api.post('/ChangePass', {
      oldPassword,newPassword,confirmPassword
    }),

  otpVerify: (MobileNo, Version, IMEI, OTP) =>
    api.post('/OTPVerify', {
      MobileNo, Version, IMEI, OTP
    }),

  resendOTP: (MobileNo, Version) =>
    api.post('/ResendOTP', {
      MobileNo, Version
    }),

  forgetPassword: (Mobileno, Password, Version, OTP) =>
    api.post('/ForgetPass', {
      Mobileno, Password, Version, OTP
    }),
    
    slider: () =>
        api.get('/SilderList')
    
};

export default ApiService;