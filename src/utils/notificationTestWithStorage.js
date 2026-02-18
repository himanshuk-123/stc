import { createDetailedNotification } from './notificationHelpers';
import { saveNotification } from './notificationStorage';

/**
 * Shows a test notification and saves it to storage
 */
export const showTestNotificationWithStorage = async () => {
  const title = 'Test Notification';
  const body = 'This is a test notification to check if notifications appear in both the notification bar and the Notifications screen.';
  const data = { screen: 'Home', test: true };
  
  // Save to storage
  await saveNotification({ title, body, data });
  
  // Also show in notification bar
  await createDetailedNotification(title, body, data);
};

/**
 * Generates multiple test notifications for UI testing
 * @param {number} count - Number of test notifications to generate
 */
export const generateMultipleTestNotifications = async (count = 5) => {
  const messages = [
    {
      title: 'Payment Received',
      body: 'You have received a payment of ₹1,000 from UserID: 12345'
    },
    {
      title: 'Transaction Failed',
      body: 'Your recent transaction of ₹500 has failed. Please try again.'
    },
    {
      title: 'Account Update',
      body: 'Your account details have been updated successfully.'
    },
    {
      title: 'New Offer Available',
      body: 'New cashback offer! Get 5% cashback on all transactions today.'
    },
    {
      title: 'Security Alert',
      body: 'A new login was detected from a new device. If this was not you, please contact support.'
    }
  ];
  
  for (let i = 0; i < count; i++) {
    const index = i % messages.length;
    const { title, body } = messages[index];
    
    // Add some randomness to the notification
    const modifiedTitle = i > 0 ? `${title} ${i+1}` : title;
    
    // Save to storage with a slight delay between notifications
    await saveNotification({ 
      title: modifiedTitle, 
      body, 
      data: { index, test: true } 
    });
    
    // Wait a bit to get different timestamps
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Only show the last one as an actual notification
  const lastNotification = messages[(count - 1) % messages.length];
  await createDetailedNotification(
    `${lastNotification.title} ${count}`,
    lastNotification.body,
    { index: count - 1, test: true }
  );
  
  return count;
};
