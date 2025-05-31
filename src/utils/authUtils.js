import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { store } from '../redux/store';
import { clearUserData, saveUserData } from '../redux/slices/userSlice';

/**
 * Global logout function that can be called from anywhere in the app
 * Clears AsyncStorage, Redux store data, and navigates to login screen
 * @param {object} navigation - The navigation object from React Navigation
 */
export const logout = async () => {
  try {
    console.log('Starting logout process...');
    
    // First ensure Redux store is cleared
    await store.dispatch(clearUserData());
    console.log('Redux store cleared');
    
    // Then clear AsyncStorage
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared');    
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

/**
 * Handles user login by saving user data to Redux store
 */
export const login = async (userData) => {
  await store.dispatch(saveUserData(userData));
};

/**
 * Checks if user is authenticated
 */
export const isAuthenticated = () => {
  const { tokenid } = store.getState().user;
  return !!tokenid;
}; 