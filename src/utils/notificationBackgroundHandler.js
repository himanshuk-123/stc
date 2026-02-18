import notifee, { EventType } from '@notifee/react-native';
import { saveNotification, markNotificationAsRead } from './notificationStorage';

// Background event handler for Notifee
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('Background event received:', type, detail);
  
  // Handle different event types
  switch (type) {
    case EventType.PRESS:
      console.log('User pressed notification', detail.notification);
      
      // Mark notification as read if it has an ID in the data
      if (detail.notification && detail.notification.data && detail.notification.data.id) {
        await markNotificationAsRead(detail.notification.data.id);
      }
      
      // You can add specific actions here based on the notification
      break;
      
    case EventType.ACTION_PRESS:
      console.log('User pressed notification action', detail.pressAction);
      
      // Handle the action press
      if (detail.pressAction.id === 'view' && detail.notification) {
        // Mark as read if view is pressed
        if (detail.notification.data && detail.notification.data.id) {
          await markNotificationAsRead(detail.notification.data.id);
        }
      } else if (detail.pressAction.id === 'dismiss' && detail.notification) {
        // Cancel the notification if dismiss is pressed
        if (detail.notification.id) {
          await notifee.cancelNotification(detail.notification.id);
        }
      }
      break;
      
    case EventType.DELIVERED:
      // A notification was delivered to the device
      if (detail.notification) {
        // Save the notification to AsyncStorage
        const { title, body, data } = detail.notification;
        await saveNotification({ title, body, data: data || {} });
      }
      break;
      
    default:
      console.log('Unhandled background event type:', type);
      break;
  }
});
