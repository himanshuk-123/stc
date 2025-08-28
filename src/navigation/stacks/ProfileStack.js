/**
 * ProfileStack - Navigation stack for all user profile related screens
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import profile related screens
import ProfileScreen from '../../screens/ProfileScreen';
import ChangePasswordScreen from '../../screens/ChangePasswordScreen';
import ChangePinScreen from '../../screens/ChangePinScreen';
import EnableDisablePinScreen from '../../screens/EnableDisablePinScreen';
import EnterPinScreen from '../../screens/EnterPinScreen';
import MemberListScreen from '../../screens/MemberListScreen';
import AddUserScreen from '../../screens/AddUserScreen';

const Stack = createNativeStackNavigator();

/**
 * Stack navigator for profile related screens
 * This is not directly used in UI but is imported by AppNavigator
 * @returns {React.ReactElement} Stack navigator component
 */
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ChangePin" component={ChangePinScreen} />
      <Stack.Screen name="EnableDisablePin" component={EnableDisablePinScreen} />
      <Stack.Screen name="EnterPin" component={EnterPinScreen} />
      <Stack.Screen name="MemberList" component={MemberListScreen} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
