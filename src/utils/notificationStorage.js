import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for notifications
const NOTIFICATIONS_STORAGE_KEY = 'fcm_notifications';

/**
 * Save a new notification to AsyncStorage
 * 
 * @param {Object} notification - The notification object to save
 * @param {string} notification.title - The notification title
 * @param {string} notification.body - The notification body
 * @param {Object} notification.data - Any additional data
 * @returns {Promise<void>}
 */
export const saveNotification = async (notification) => {
  try {
    // Create a notification object with ID and timestamp
    const notificationToSave = {
      id: Date.now().toString(), // Use timestamp as unique ID
      title: notification.title || '',
      body: notification.body || '',
      data: notification.data || {},
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Get existing notifications
    const existingNotifications = await getNotifications();
    
    // Add new notification at the beginning (newest first)
    const updatedNotifications = [notificationToSave, ...existingNotifications];
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY, 
      JSON.stringify(updatedNotifications)
    );
    
    return notificationToSave;
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

/**
 * Get all stored notifications
 * 
 * @returns {Promise<Array>} - Array of notification objects
 */
export const getNotifications = async () => {
  try {
    const notificationsJSON = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return notificationsJSON ? JSON.parse(notificationsJSON) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

/**
 * Delete a notification by ID
 * 
 * @param {string} notificationId - The ID of the notification to delete
 * @returns {Promise<void>}
 */
export const deleteNotification = async (notificationId) => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    await AsyncStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

/**
 * Delete all notifications
 * 
 * @returns {Promise<void>}
 */
export const deleteAllNotifications = async () => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error deleting all notifications:', error);
  }
};

/**
 * Mark a notification as read
 * 
 * @param {string} notificationId - The ID of the notification to mark as read
 * @returns {Promise<void>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    await AsyncStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

/**
 * Get the count of unread notifications
 * 
 * @returns {Promise<number>} - Number of unread notifications
 */
export const getUnreadNotificationsCount = async () => {
  try {
    const notifications = await getNotifications();
    return notifications.filter(notification => !notification.read).length;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    return 0;
  }
};
