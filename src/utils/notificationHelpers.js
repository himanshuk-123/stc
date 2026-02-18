import notifee, { AndroidStyle, AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

/**
 * Creates a notification channel for Android
 * @returns {Promise<string>} The channel ID
 */
export const createNotificationChannel = async () => {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
    lights: true,
  });
  
  return channelId;
};

/**
 * Creates a detailed notification with image and actions
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {Object} data - Additional data to include with the notification
 * @param {string} [imageUrl] - Optional URL for the notification image
 */
export const createDetailedNotification = async (title, body, data = {}, imageUrl = null) => {
  try {
    // Create or get the default channel
    const channelId = await createNotificationChannel();
    
    // Generate a notification ID if not provided
    const notificationId = data.id || Date.now().toString();
    
    // Ensure the ID is included in the data for future reference
    const notificationData = {
      ...data,
      id: notificationId,
      timestamp: new Date().toISOString()
    };
    
    // Build the notification
    const notification = {
      id: notificationId,
      title: title || 'New Notification',
      body: body || '',
      data: notificationData,
      android: {
        channelId,
        smallIcon: 'notification_icon',
        color: '#121283', // Use the primary color of your app
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        actions: [
          {
            title: 'View',
            pressAction: {
              id: 'view',
            },
          },
          {
            title: 'Dismiss',
            pressAction: {
              id: 'dismiss',
            },
          },
        ],
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    };
    
    // Add image if provided (for Android only)
    if (imageUrl && Platform.OS === 'android') {
      notification.android.style = {
        type: AndroidStyle.BIGPICTURE,
        picture: imageUrl,
      };
    }
    
    // Display the notification
    await notifee.displayNotification(notification);
    console.log('Detailed notification displayed with Notifee');
  } catch (error) {
    console.error('Error displaying detailed notification:', error);
  }
};

/**
 * Cancels all notifications
 */
export const cancelAllNotifications = async () => {
  await notifee.cancelAllNotifications();
};

/**
 * Cancels a specific notification
 * @param {string} notificationId - The ID of the notification to cancel
 */
export const cancelNotification = async (notificationId) => {
  await notifee.cancelNotification(notificationId);
};

/**
 * Get all delivered notifications
 * @returns {Promise<Array>} Array of notification objects
 */
export const getDeliveredNotifications = async () => {
  return await notifee.getDisplayedNotifications();
};
