import { SafeAreaView, StatusBar, View, Platform, Modal, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import RootNavigator from './src/navigation/RootNavigator'
import { setupNotifications } from './src/utils/notificationService'
import notifee, { EventType } from '@notifee/react-native'
import Toast from 'react-native-toast-message'
import NetInfo from '@react-native-community/netinfo'
import { setupAxiosInterceptors } from './src/utils/axiosConfig'
import { addNetworkErrorListener, emitNetworkError } from './src/utils/networkModal'
// Import background handler to ensure it's included in the bundle
import './src/utils/notificationBackgroundHandler'
import { markNotificationAsRead } from './src/utils/notificationStorage'


const App = () => {
  const wasOnlineRef = useRef(true);
  const [networkModalVisible, setNetworkModalVisible] = useState(false);
  const [networkMessage, setNetworkMessage] = useState('Please check your network and try again');

  useEffect(() => {
    // Setup global axios interceptors for network error handling
    setupAxiosInterceptors();

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected === true;
      const isInternetReachable = state.isInternetReachable !== false;
      const isOnline = isConnected && isInternetReachable;

      if (wasOnlineRef.current && !isOnline) {
        emitNetworkError('No internet connection');
      }

      wasOnlineRef.current = isOnline;
    });
    
    const unsubscribeNetworkModal = addNetworkErrorListener((message) => {
      setNetworkMessage(message || 'Please check your network and try again');
      setNetworkModalVisible(true);
    });

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
      unsubscribeNetInfo();
      unsubscribeNetworkModal.remove();
      unsubscribeNotifee();
    };
  }, []);

  const handleNetworkModalClose = () => {
    setNetworkModalVisible(false);
  };
  
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
      <Modal transparent visible={networkModalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#111' }}>No Internet Connection</Text>
            <Text style={{ fontSize: 14, color: '#444', textAlign: 'center', marginBottom: 16 }}>{networkMessage}</Text>
            <TouchableOpacity onPress={handleNetworkModalClose} style={{ backgroundColor: '#0b0866', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast />
    </LinearGradient>
    </Provider>
  )
}

export default App