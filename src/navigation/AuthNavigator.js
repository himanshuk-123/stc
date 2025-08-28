/**
 * AuthNavigator - Navigation stack for unauthenticated users
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import navigation configuration
import { ROUTES, SCREEN_OPTIONS } from './NavigationConfig';

// Import auth screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OtpVerifyScreen from '../screens/otpVerifyScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ContactScreen from '../screens/ContactScreen';

const Stack = createNativeStackNavigator();

/**
 * Authentication stack navigator for unauthenticated users
 * @returns {React.ReactElement} Stack navigator component
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName={ROUTES.AUTH.LOGIN}
      screenOptions={SCREEN_OPTIONS.DEFAULT}
    >
      <Stack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.AUTH.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={ROUTES.AUTH.OTP_VERIFY} component={OtpVerifyScreen} />
      <Stack.Screen name={ROUTES.AUTH.FORGET_PASSWORD} component={ForgetPasswordScreen} />
      <Stack.Screen name={ROUTES.AUTH.CONTACT} component={ContactScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;