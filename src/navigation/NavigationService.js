/**
 * NavigationService - A service for navigating between screens from outside of a component
 * This allows navigation from redux actions, API response handlers, or other non-component code
 */
import { createRef } from 'react';
import { CommonActions, StackActions } from '@react-navigation/native';

// Create a navigation reference that can be accessed from anywhere
export const navigationRef = createRef();

/**
 * Navigate to a screen
 * @param {string} name - The name of the route to navigate to
 * @param {Object} params - Parameters to pass to the destination route
 */
export const navigate = (name, params) => {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    // Navigation failed - store the navigation request for when the navigator is ready
    pendingNavigationRequest = { name, params };
  }
};

/**
 * Reset the navigation state to a route
 * @param {string} name - The name of the route to navigate to
 * @param {Object} params - Parameters to pass to the destination route
 */
export const resetRoot = (name, params = {}) => {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      })
    );
  }
};

/**
 * Replace the current screen with a new one
 * @param {string} name - The name of the route to navigate to
 * @param {Object} params - Parameters to pass to the destination route
 */
export const replace = (name, params = {}) => {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.replace(name, params));
  }
};

/**
 * Go back to the previous screen
 */
export const goBack = () => {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  }
};

/**
 * Go back to a specific screen in the navigation history
 * @param {string} name - The name of the route to go back to
 */
export const popToTop = () => {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.popToTop());
  }
};

/**
 * Push a new screen onto the stack
 * @param {string} name - The name of the route to navigate to
 * @param {Object} params - Parameters to pass to the destination route
 */
export const push = (name, params = {}) => {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.push(name, params));
  }
};

/**
 * Get the current route information
 * @returns {Object|null} The current route object or null if not available
 */
export const getCurrentRoute = () => {
  if (navigationRef.current) {
    return navigationRef.current.getCurrentRoute();
  }
  return null;
};

// Store pending navigation request when the navigator is not yet initialized
let pendingNavigationRequest = null;

/**
 * Check if there's a pending navigation request and execute it
 * Call this when the navigator is ready
 */
export const processPendingNavigation = () => {
  if (pendingNavigationRequest && navigationRef.current) {
    const { name, params } = pendingNavigationRequest;
    navigate(name, params);
    pendingNavigationRequest = null;
  }
};

// Export the navigation service as default
export default {
  navigate,
  resetRoot,
  replace,
  goBack,
  popToTop,
  push,
  getCurrentRoute,
  navigationRef,
  processPendingNavigation,
};
