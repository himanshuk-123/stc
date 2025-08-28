/**
 * useAppNavigation - Custom hook for navigation with improved type safety
 */
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ROUTES } from '../navigation/NavigationConfig';
import NavigationService from '../navigation/NavigationService';

/**
 * Custom navigation hook that provides type-safe navigation methods
 * @returns {Object} Navigation methods and properties
 */
export const useAppNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  /**
   * Navigate to a screen with parameters
   * @param {string} screenName - The name of the screen to navigate to
   * @param {Object} params - Parameters to pass to the screen
   */
  const navigateTo = useCallback(
    (screenName, params = {}) => {
      navigation.navigate(screenName, params);
    },
    [navigation]
  );

  /**
   * Navigate to a screen in a specific stack
   * @param {string} stackName - The name of the stack
   * @param {string} screenName - The name of the screen in the stack
   * @param {Object} params - Parameters to pass to the screen
   */
  const navigateToStack = useCallback(
    (stackName, screenName, params = {}) => {
      navigation.navigate(stackName, {
        screen: screenName,
        params,
      });
    },
    [navigation]
  );

  /**
   * Navigate to the recharge stack
   * @param {string} screenName - The name of the screen in the recharge stack
   * @param {Object} params - Parameters to pass to the screen
   */
  const navigateToRecharge = useCallback(
    (screenName, params = {}) => {
      navigateToStack('RechargeStack', screenName, params);
    },
    [navigateToStack]
  );

  /**
   * Navigate to the reports stack
   * @param {string} screenName - The name of the screen in the reports stack
   * @param {Object} params - Parameters to pass to the screen
   */
  const navigateToReports = useCallback(
    (screenName, params = {}) => {
      navigateToStack('ReportsStack', screenName, params);
    },
    [navigateToStack]
  );

  /**
   * Navigate to the payment stack
   * @param {string} screenName - The name of the screen in the payment stack
   * @param {Object} params - Parameters to pass to the screen
   */
  const navigateToPayment = useCallback(
    (screenName, params = {}) => {
      navigateToStack('PaymentStack', screenName, params);
    },
    [navigateToStack]
  );

  /**
   * Navigate to the profile stack
   * @param {string} screenName - The name of the screen in the profile stack
   * @param {Object} params - Parameters to pass to the screen
   */
  const navigateToProfile = useCallback(
    (screenName, params = {}) => {
      navigateToStack('ProfileStack', screenName, params);
    },
    [navigateToStack]
  );

  /**
   * Navigate to the support stack
   * @param {string} screenName - The name of the screen in the support stack
   * @param {Object} params - Parameters to pass to the screen
   */
  const navigateToSupport = useCallback(
    (screenName, params = {}) => {
      navigateToStack('SupportStack', screenName, params);
    },
    [navigateToStack]
  );

  /**
   * Go back to the previous screen
   */
  const goBack = useCallback(() => {
    navigation.canGoBack() ? navigation.goBack() : navigateTo(ROUTES.APP.MAIN_TABS);
  }, [navigation, navigateTo]);

  /**
   * Reset the navigation stack and navigate to a screen
   * @param {string} screenName - The name of the screen to navigate to
   * @param {Object} params - Parameters to pass to the screen
   */
  const resetAndNavigateTo = useCallback(
    (screenName, params = {}) => {
      NavigationService.resetRoot(screenName, params);
    },
    []
  );

  /**
   * Replace the current screen with a new one
   * @param {string} screenName - The name of the screen to navigate to
   * @param {Object} params - Parameters to pass to the screen
   */
  const replaceWith = useCallback(
    (screenName, params = {}) => {
      NavigationService.replace(screenName, params);
    },
    []
  );

  return {
    navigation,
    route,
    params: route.params || {},
    navigateTo,
    navigateToStack,
    navigateToRecharge,
    navigateToReports,
    navigateToPayment,
    navigateToProfile,
    navigateToSupport,
    goBack,
    resetAndNavigateTo,
    replaceWith,
    useFocusEffect,
  };
};

export default useAppNavigation;
