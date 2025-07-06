# Secure Storage Implementation

For a more secure implementation of the "Remember Me" feature, we recommend using `expo-secure-store` instead of AsyncStorage for storing sensitive credentials.

## Installation

```bash
npm install expo-secure-store
# or
yarn add expo-secure-store
```

## Usage

Replace AsyncStorage with SecureStore for storing sensitive information like passwords:

```javascript
import * as SecureStore from 'expo-secure-store';

// Save credentials securely
const saveCredentials = async (phone, password, shouldRemember) => {
  try {
    if (shouldRemember) {
      await SecureStore.setItemAsync('savedLoginPhone', phone);
      await SecureStore.setItemAsync('savedLoginPassword', password);
    } else {
      await SecureStore.deleteItemAsync('savedLoginPhone');
      await SecureStore.deleteItemAsync('savedLoginPassword');
    }
  } catch (error) {
    console.error('Error handling credentials:', error);
  }
};

// Load credentials securely
const loadCredentials = async () => {
  try {
    const savedPhone = await SecureStore.getItemAsync('savedLoginPhone');
    const savedPassword = await SecureStore.getItemAsync('savedLoginPassword');
    
    if (savedPhone && savedPassword) {
      setPhone(savedPhone);
      setPassword(savedPassword);
      setRememberMe(true);
      return true;
    }
  } catch (error) {
    console.error('Error loading saved credentials:', error);
  }
  return false;
};
```

This approach provides better security for sensitive user data compared to AsyncStorage.
