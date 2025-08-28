/**
 * NavigationWrapper - Wrapper component that handles navigation transitions and loading states
 */
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';

/**
 * Wrapper component that provides consistent navigation transitions and loading states
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.isLoading - Whether the content is loading
 * @param {Function} props.onMount - Function to call when component mounts
 * @param {Object} props.style - Additional styles for the container
 * @returns {React.ReactElement} Wrapped component
 */
const NavigationWrapper = ({ 
  children, 
  isLoading = false, 
  onMount = null, 
  style = {} 
}) => {
  const [isReady, setIsReady] = useState(!onMount);

  useEffect(() => {
    const prepareComponent = async () => {
      if (onMount) {
        await onMount();
      }
      setIsReady(true);
    };

    prepareComponent();
  }, [onMount]);

  if (!isReady || isLoading) {
    return (
      <View 
        style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: COLORS.BACKGROUND,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: COLORS.BACKGROUND }, style]}>
      {children}
    </View>
  );
};

export default NavigationWrapper;
