# Migrating Screens from Context API to Redux

To migrate all remaining screens from using Context API to Redux, follow these steps for each file:

## Standard Replacement Pattern

1. **Import changes**:
   - Remove: `import { useContext } from 'react';`
   - Remove: `import { UserContext } from '../context/UserContext';`
   - Add: `import { useSelector } from 'react-redux';`

2. **Usage changes**:
   - Replace: `const { userData } = useContext(UserContext);`
   - With: `const userData = useSelector(state => state.user);`

3. **For screens that need to update data**:
   - Add: `import { useDispatch } from 'react-redux';`
   - Add: `import { saveUserData, clearUserData } from '../redux/slices/userSlice';`
   - Add: `const dispatch = useDispatch();`
   - Replace: `saveUserData(data);` 
   - With: `dispatch(saveUserData(data));`
   - Replace: `clearUserData();`
   - With: `dispatch(clearUserData());`

## Files that Need to Be Updated

- src/screens/ComissionScreen.jsx
- src/screens/BalanceCheckScreen.jsx
- src/screens/DTHRechargeScreen.jsx
- src/screens/FundRequestListScreen.jsx
- src/screens/ContactScreen.jsx
- src/screens/MemberListScreen.jsx
- src/screens/ComplainListScreen.jsx
- src/screens/otpVerifyScreen.jsx
- src/screens/RechargeReportScreen.jsx
- src/screens/TransactionReportScreen.jsx
- src/screens/UserDayBookScreen.jsx
- src/screens/SupportScreen.jsx
- src/screens/StandingReportScreen.jsx

## Example Migration

### Before:
```jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const MyComponent = () => {
  const { userData, saveUserData, clearUserData } = useContext(UserContext);
  
  const handleSave = () => {
    saveUserData({ username: 'new name' });
  };
  
  const handleLogout = () => {
    clearUserData();
  };
  
  return (...);
};
```

### After:
```jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData, clearUserData } from '../redux/slices/userSlice';

const MyComponent = () => {
  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  const handleSave = () => {
    dispatch(saveUserData({ username: 'new name' }));
  };
  
  const handleLogout = () => {
    dispatch(clearUserData());
  };
  
  return (...);
};
```

## Final Step

Once all screens have been updated, you can safely delete:
- src/context/UserContext.js 