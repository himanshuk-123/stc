# Global Network Error Handling

This implementation provides global network error handling with toast messages, similar to apps like Amazon and Flipkart.

## Features

✅ **No Logout on Network Errors** - Users stay logged in when network fails
✅ **Toast Messages** - Clean, non-intrusive error messages at bottom of screen
✅ **Global Implementation** - Works automatically for all API calls
✅ **Automatic Network Check** - Checks connectivity before each request

## How It Works

### 1. Global Axios Interceptors
All axios requests (across the entire app) are automatically intercepted:
- **Before Request**: Checks if internet is available
- **After Response**: Catches any network errors that occur

### 2. Toast Notifications
When a network issue occurs, users see a toast message like:
```
❌ No Internet Connection
Please check your network and try again
```

### 3. Files Modified

- **App.jsx** - Added Toast component and setup axios interceptors
- **src/utils/axiosConfig.js** - Global axios configuration (NEW)
- **src/utils/networkUtils.js** - Network utility functions (NEW)
- **src/services/api.js** - Added interceptors to api instance
- **src/services/authService.js** - Added interceptors to auth api instance

## Usage

### Automatic (Recommended)
No code changes needed! All existing API calls are automatically protected:

```javascript
// This will automatically show toast on network error
const response = await api.post('/Login', { Name, Pass });
```

### Manual Check (Optional)
For special cases where you want to check network before doing something:

```javascript
import { checkNetworkConnectivity, showNetworkErrorToast } from '../utils/networkUtils';

const handleAction = async () => {
  const isConnected = await checkNetworkConnectivity();
  
  if (!isConnected) {
    showNetworkErrorToast('Please connect to internet');
    return;
  }
  
  // Proceed with action
};
```

### With Wrapper (Optional)
Wrap any API call with network check:

```javascript
import { withNetworkCheck } from '../utils/networkUtils';

try {
  const result = await withNetworkCheck(async () => {
    return await someApiCall();
  });
} catch (error) {
  if (error.message === 'NO_NETWORK') {
    // Network was unavailable
  }
}
```

## Toast Message Types

The interceptor shows different messages for different scenarios:

1. **No Internet Connection**
   - Shown when device has no network before request
   - "Please check your network and try again"

2. **Network Error**
   - Shown when request fails due to network issues
   - "Unable to reach server. Please check your connection."

3. **Request Timeout**
   - Shown when request takes too long
   - "The request took too long. Please try again."

## Testing

To test the network error handling:

1. Turn off WiFi/Mobile data on your device
2. Try to perform any action that requires API call (login, recharge, etc.)
3. You should see a toast message at bottom
4. User remains logged in and can try again after network is restored

## Benefits

- **Better UX**: Users aren't logged out due to temporary network issues
- **Consistent**: Same error handling across entire app
- **Maintainable**: One place to update network error behavior
- **Clean Code**: No need to add network checks in every screen
