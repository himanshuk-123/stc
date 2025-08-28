/**
 * RootNavigator - Root navigation component that handles authentication state
 */
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadUserData } from '../redux/slices/userSlice';

// Import navigation service
import NavigationService, { navigationRef } from './NavigationService';

// Import navigators
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

/**
 * Root navigator that switches between auth and app navigators based on authentication state
 * @returns {React.ReactElement} NavigationContainer with appropriate navigator
 */
const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { tokenid, loading } = useAppSelector((state) => state.user);

  // Load user data from AsyncStorage when app starts
  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  // Process any pending navigation requests once the navigator is ready
  const onNavigationReady = () => {
    NavigationService.processPendingNavigation();
  };

  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={onNavigationReady}
    >
      {tokenid ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;