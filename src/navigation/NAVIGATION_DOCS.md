# Navigation Structure Documentation

## Overview

This document describes the navigation structure of the application after refactoring. The navigation system has been organized into a hierarchical structure to improve maintainability, code organization, and navigation performance.

## Navigation Components

### 1. RootNavigator (src/navigation/RootNavigator.js)
- Serves as the entry point for all navigation
- Determines whether to show auth screens or main app screens based on authentication state
- Provides the NavigationContainer context for the entire app

### 2. AuthNavigator (src/navigation/AuthNavigator.js)
- Stack navigator for unauthenticated users
- Contains screens for login, registration, OTP verification, and password recovery

### 3. AppNavigator (src/navigation/AppNavigator.js)
- Stack navigator for authenticated users
- Contains the main tab navigation and all app screens
- Organized with stack navigators for different feature areas

### 4. TabRouter (src/router/tabRouter.js)
- Bottom tab navigation for main app sections
- Contains Home, Services, and More tabs

## Feature-Specific Stack Navigators

Navigation has been organized into feature-specific stacks to improve code organization and performance:

### 1. RechargeStack (src/navigation/stacks/RechargeStack.js)
- Contains all recharge-related screens
- Mobile recharge, DTH recharge, company recharge, etc.

### 2. ReportsStack (src/navigation/stacks/ReportsStack.js)
- Contains all report-related screens
- Transaction reports, standing reports, user daybook, etc.

### 3. PaymentStack (src/navigation/stacks/PaymentStack.js)
- Contains all payment-related screens
- Add money, wallet payment, wallet topup, etc.

### 4. ProfileStack (src/navigation/stacks/ProfileStack.js)
- Contains all profile-related screens
- Profile details, change password, change PIN, etc.

### 5. SupportStack (src/navigation/stacks/SupportStack.js)
- Contains all support-related screens
- Support, contact, complain list, etc.

## Navigation Utilities

### 1. NavigationService (src/navigation/NavigationService.js)
- Provides navigation methods that can be called from outside of React components
- Useful for navigation from Redux actions, API callbacks, etc.

### 2. NavigationConfig (src/navigation/NavigationConfig.js)
- Contains constants for route names, screen options, and navigation types
- Provides type safety and prevents typos in route names

### 3. NavigationWrapper (src/navigation/NavigationWrapper.js)
- Wrapper component for consistent navigation transitions and loading states
- Provides a standard way to handle loading states in screens

### 4. useAppNavigation (src/hooks/useAppNavigation.js)
- Custom hook for simplified navigation with type safety
- Provides methods for navigating to specific stacks and screens

## Screen Navigation Flow

1. User starts at the RootNavigator, which checks authentication state
2. If not authenticated, user sees AuthNavigator screens
3. After authentication, user sees AppNavigator screens
4. Main app experience is through TabRouter with bottom tabs
5. From tabs, user can navigate to feature-specific stacks

## Usage Examples

### Navigating with useAppNavigation hook:

```javascript
import { useAppNavigation } from '../hooks/useAppNavigation';
import { ROUTES } from '../navigation/NavigationConfig';

const MyComponent = () => {
  const { navigateTo, navigateToRecharge } = useAppNavigation();

  // Navigate to any screen
  const goToProfile = () => {
    navigateTo(ROUTES.PROFILE.MAIN);
  };

  // Navigate to a screen in a specific stack
  const goToDTHRecharge = () => {
    navigateToRecharge(ROUTES.RECHARGE.DTH);
  };

  return (
    // Component JSX
  );
};
```

### Using NavigationWrapper:

```javascript
import NavigationWrapper from '../navigation/NavigationWrapper';

const MyScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const loadData = async () => {
    // Fetch data...
    setIsLoading(false);
  };

  return (
    <NavigationWrapper isLoading={isLoading} onMount={loadData}>
      {/* Screen content */}
    </NavigationWrapper>
  );
};
```

## Backward Compatibility

To maintain backward compatibility during migration, the AppNavigator includes screen definitions for both the old direct navigation approach and the new stack-based approach. This allows for a gradual migration without breaking existing code.

## Best Practices

1. Always use the ROUTES constants from NavigationConfig instead of hardcoded strings
2. Use the useAppNavigation hook for all navigation within components
3. Use NavigationService for navigation outside of components
4. Wrap screen components with NavigationWrapper for consistent loading states
5. Keep related screens in the appropriate feature stack
