import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';
import { createDetailedNotification } from './notificationHelpers';
import { saveNotification } from './notificationStorage';

// Function to display a notification in the notification bar (using Notifee)
const displayNotification = async (title, body, data = {}) => {
  try {
    // Save notification to AsyncStorage
    await saveNotification({ title, body, data });
    
    // Display the notification in the notification bar
    await createDetailedNotification(title, body, data);
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};

export const requestUserPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log('Notification permission response:', granted);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Error requesting notification permission:', error);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    console.log('Authorization status:', authStatus);
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  return false;
};

export const getFCMToken = async () => {
  try {
    // Check if we have a token saved
    let fcmToken = await AsyncStorage.getItem('fcm_token');
    
    if (!fcmToken) {
      // Request a new token
      fcmToken = await messaging().getToken();
      
      if (fcmToken) {
        await AsyncStorage.setItem('fcm_token', fcmToken);
        console.log('New FCM token generated:', fcmToken);
      }
    } else {
      console.log('Retrieved existing FCM token:', fcmToken);
    }
    
    return fcmToken;
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
};

export const setupNotifications = async () => {
  try {
    // Request permission
    const hasPermission = await requestUserPermission();
    console.log('Has notification permission:', hasPermission);
    
    if (hasPermission) {
      // Get FCM token
      const token = await getFCMToken();
      console.log('FCM token:', token);
      
      // Listen for token refresh
      const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
        console.log('FCM token refreshed:', newToken);
        await AsyncStorage.setItem('fcm_token', newToken);
      });
      
      // Set up foreground message handler
      const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
        console.log('Foreground notification received:', remoteMessage);
        
        // Display notification in the notification bar using Notifee
        if (remoteMessage?.notification) {
          await displayNotification(
            remoteMessage.notification.title,
            remoteMessage.notification.body,
            remoteMessage.data || {}
          );
        }
      });
      
      // Check if app was opened from a notification
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App opened from notification:', initialNotification);
      }
      
      return () => {
        unsubscribeTokenRefresh();
        unsubscribeOnMessage();
      };
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.log('Error setting up notifications:', error);
  }
};

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background:', remoteMessage);
  
  // Display notification in the notification bar using Notifee
  if (remoteMessage?.notification) {
    await displayNotification(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
      remoteMessage.data || {}
    );
  }
});