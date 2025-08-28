/**
 * SupportStack - Navigation stack for all support related screens
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import support related screens
import SupportScreen from '../../screens/SupportScreen';
import ContactScreen from '../../screens/ContactScreen';
import ComplainListScreen from '../../screens/ComplainListScreen';
import BookComplain from '../../screens/BookComplain';

const Stack = createNativeStackNavigator();

/**
 * Stack navigator for support related screens
 * This is not directly used in UI but is imported by AppNavigator
 * @returns {React.ReactElement} Stack navigator component
 */
const SupportStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SupportMain" component={SupportScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="ComplainList" component={ComplainListScreen} />
      <Stack.Screen name="BookComplain" component={BookComplain} />
    </Stack.Navigator>
  );
};

export default SupportStack;
