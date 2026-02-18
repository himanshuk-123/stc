import { SafeAreaView, StatusBar, View, Platform } from 'react-native'
import React, { useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import RootNavigator from './src/navigation/RootNavigator'
import { setupNotifications } from './src/utils/notificationService'
import notifee, { EventType } from '@notifee/react-native'
import Toast from 'react-native-toast-message'
import { setupAxiosInterceptors } from './src/utils/axiosConfig'
// Import background handler to ensure it's included in the bundle
import './src/utils/notificationBackgroundHandler'
import { markNotificationAsRead } from './src/utils/notificationStorage'


const App = () => {
  useEffect(() => {
    // Setup global axios interceptors for network error handling
    setupAxiosInterceptors();
    
    // Initialize Notifee foreground handler
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      console.log('Notifee foreground event:', type, detail);
      
      // Handle notification press in foreground
      if (type === EventType.PRESS) {
        if (detail.notification && detail.notification.data && detail.notification.data.id) {
          markNotificationAsRead(detail.notification.data.id);
        }
      }
      
      // Handle notification action press in foreground
      if (type === EventType.ACTION_PRESS) {
        if (detail.pressAction.id === 'view' && detail.notification?.data?.id) {
          markNotificationAsRead(detail.notification.data.id);
        }
      }
    });
    
    // Set up Firebase Cloud Messaging notifications
    const unsubscribe = setupNotifications();
    
    // Clean up notification listeners when component unmounts
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      unsubscribeNotifee();
    };
  }, []);
  
  return (
    <Provider store={store}>
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: '#121283ff' }} />
      )}
      <StatusBar 
        backgroundColor="#0b0866" 
        style="light" 
        barStyle={"light-content"} 
        hidden={false} 
        translucent={true} 
      />
    <LinearGradient
      colors={['#7ad6f0', '#ffffff']}
      style={{ flex: 1 }}
    >
        <SafeAreaView style={{ flex: 1 }}>
          <RootNavigator />
      </SafeAreaView>
      <Toast />
    </LinearGradient>
    </Provider>
  )
}

export default App