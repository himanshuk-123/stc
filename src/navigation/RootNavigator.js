import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadUserData } from '../redux/slices/userSlice';

// Import navigators
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { tokenid, loading } = useAppSelector((state) => state.user);

  // Load user data from AsyncStorage when app starts
  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  return (
    <NavigationContainer>
      {tokenid ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator; 