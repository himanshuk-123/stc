import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import auth screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OtpVerifyScreen from '../screens/otpVerifyScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
// import ChangePasswordScreen from '../screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 