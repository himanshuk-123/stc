import { createDetailedNotification } from './notificationHelpers';

/**
 * Shows a test notification
 */
export const showTestNotification = async () => {
  await createDetailedNotification(
    'Test Notification',
    'This is a test notification to check if notifications appear in the notification bar.',
    { screen: 'Home' }
  );
};

/**
 * Shows a test notification with an image
 */
export const showTestNotificationWithImage = async (imageUrl) => {
  await createDetailedNotification(
    'Test Notification with Image',
    'This is a test notification with an image.',
    { screen: 'Home' },
    imageUrl || 'https://reactnative.dev/img/tiny_logo.png' // Default test image
  );
};
