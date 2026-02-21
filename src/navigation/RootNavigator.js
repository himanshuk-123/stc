import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadUserData } from '../redux/slices/userSlice';

// Import navigators
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { tokenid } = useAppSelector((state) => state.user);
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  // Load user data from AsyncStorage when app starts
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await dispatch(loadUserData());
      } finally {
        setIsBootstrapped(true);
      }
    };

    bootstrap();
  }, [dispatch]);

  if (!isBootstrapped) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {tokenid ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator; 