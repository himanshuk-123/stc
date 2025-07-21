import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions - we're using iPhone 8 as our base size
const baseWidth = 375;
const baseHeight = 667;
const standardScreenHeight = 680;

// Scales the size based on screen width
export const horizontalScale = (size) => {
  const scale = SCREEN_WIDTH / baseWidth;
  return size * scale;
};

// Scales the size based on screen height
export const verticalScale = (size) => {
  const scale = SCREEN_HEIGHT / baseHeight;
  return size * scale;
};

// Scales the font size with a factor to avoid too large fonts on big screens
export const moderateScale = (size, factor = 0.5) => {
  const scale = SCREEN_WIDTH / baseWidth;
  return size + (scale - 1) * size * factor;
};

// Get screen dimensions
export const getScreenDimensions = () => {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  };
};

// Calculate percentage of screen width (similar to wp from react-native-responsive-screen)
export const wp = (percentage) => {
  return (percentage / 100) * SCREEN_WIDTH;
};

// Calculate percentage of screen height (similar to hp from react-native-responsive-screen)
export const hp = (percentage) => {
  return (percentage / 100) * SCREEN_HEIGHT;
};

// Aliases for backward compatibility
export const widthPercentage = wp;
export const heightPercentage = hp;

// RFValue function (similar to react-native-responsive-fontsize)
export const RFValue = (fontSize, standardScreenHeight = 680) => {
  const heightPercent = (SCREEN_HEIGHT * 100) / standardScreenHeight;
  return Math.round(fontSize * heightPercent / 100);
};

// Responsive font sizing with additional control
export const responsiveFontSize = (size, factor = 0.5) => {
  return RFValue(moderateScale(size, factor));
};

// Responsive image dimensions
export const responsiveImageDimensions = (baseWidth, baseHeight, widthPercentage = 0.2) => {
  const calculatedWidth = SCREEN_WIDTH * widthPercentage;
  const calculatedHeight = (calculatedWidth / baseWidth) * baseHeight;
  
  return {
    width: calculatedWidth,
    height: calculatedHeight,
  };
};

// Responsive padding and margin values
export const spacing = {
  xs: moderateScale(2),
  s: moderateScale(4),
  m: moderateScale(8),
  l: moderateScale(16),
  xl: moderateScale(24),
  xxl: moderateScale(32),
};

// Device type detection
export const isTablet = () => {
  const shortDimension = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
  const longDimension = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT);
  
  return (shortDimension >= 600 || longDimension >= 900);
};