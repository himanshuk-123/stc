# Firebase Push Notification Setup Guide

This guide explains how to set up Firebase Cloud Messaging (FCM) for push notifications in your STC app.

## Prerequisites

1. A Firebase project set up on the [Firebase Console](https://console.firebase.google.com/)
2. The `google-services.json` file downloaded and placed in the `android/app` folder

## Integration Steps

### 1. Android Configuration

The app is already configured with the necessary dependencies and permissions for FCM push notifications:

- Firebase dependencies are added in `package.json`:
  - `@react-native-firebase/app`
  - `@react-native-firebase/messaging`

- Required Android permissions have been added to `AndroidManifest.xml`:
  - `POST_NOTIFICATIONS` - For displaying notifications on Android 13+
  - `RECEIVE_BOOT_COMPLETED` - For receiving notifications when device restarts
  - `VIBRATE` - For vibration with notifications

- The notification icon and color have been configured

### 2. Using the Notification Service

The notification service is implemented in `src/utils/notificationService.js` and provides these key functions:

- `requestUserPermission()`: Request permission to show notifications
- `getFCMToken()`: Get the FCM token for the device
- `setupNotifications()`: Set up notification listeners for foreground, background, and app-opening events

### 3. App Integration

The main `App.jsx` file is configured to initialize the notification service when the app starts.

### 4. Testing Notifications

To test push notifications:

1. Get the FCM token from your app (printed in the console when the app starts)
2. Use the Firebase Console to send a test message to this token
3. You can also use Firebase Cloud Functions or your backend server to send notifications

### 5. Customizing Notifications

To customize the notification appearance:

- The notification icon is defined in `android/app/src/main/res/drawable/notification_icon.xml`
- The notification color is defined in `android/app/src/main/res/values/colors.xml`

### 6. Troubleshooting

If notifications aren't working:

1. Check that the app has notification permissions
2. Verify that the FCM token is being generated and logged to the console
3. Ensure your Firebase project is properly set up and the `google-services.json` file is correctly placed
4. Test with both foreground and background notifications

## Additional Resources

- [React Native Firebase Messaging Documentation](https://rnfirebase.io/messaging/usage)
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
