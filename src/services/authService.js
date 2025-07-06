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