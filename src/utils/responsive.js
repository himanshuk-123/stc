/**
 * Responsive utility functions for consistent UI scaling across different device sizes
 */
import { Dimensions, PixelRatio } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions - we're using iPhone 8 as our base size
// All calculations will be relative to these dimensions
const BASE_WIDTH = 375;
const BASE_HEIGHT = 667;

/**
 * Scales a size horizontally based on screen width
 * @param {number} size - Size to scale
 * @returns {number} - Scaled size
 */
export const horizontalScale = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return size * scale;
};

/**
 * Scales a size vertically based on screen height
 * @param {number} size - Size to scale
 * @returns {number} - Scaled size
 */
export const verticalScale = (size) => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return size * scale;
};

/**
 * Scales the font size with a factor to avoid too large fonts on big screens
 * @param {number} size - Size to scale
 * @param {number} [factor=0.5] - Factor to reduce scaling effect
 * @returns {number} - Moderately scaled size
 */
export const moderateScale = (size, factor = 0.5) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return size + (scale - 1) * size * factor;
};

/**
 * Gets current screen dimensions
 * @returns {Object} - Width and height of the screen
 */
export const getScreenDimensions = () => {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  };
};

/**
 * Calculates percentage of screen width
 * @param {number} percentage - Percentage value (0-100)
 * @returns {number} - Width value corresponding to the percentage
 */
export const wp = (percentage) => {
  return (percentage / 100) * SCREEN_WIDTH;
};

/**
 * Calculates percentage of screen height
 * @param {number} percentage - Percentage value (0-100)
 * @returns {number} - Height value corresponding to the percentage
 */
export const hp = (percentage) => {
  return (percentage / 100) * SCREEN_HEIGHT;
};

// Aliases for backward compatibility
export const widthPercentage = wp;
export const heightPercentage = hp;

/**
 * Responsive Font Size (similar to react-native-responsive-fontsize)
 * @param {number} fontSize - Base font size
 * @param {number} [standardScreenHeight=680] - Standard screen height for reference
 * @returns {number} - Responsive font size
 */
export const RFValue = (fontSize, standardScreenHeight = 680) => {
  const heightPercent = (SCREEN_HEIGHT * 100) / standardScreenHeight;
  return PixelRatio.roundToNearestPixel(fontSize * heightPercent / 100);
};

/**
 * Get pixel density of the device
 * @returns {number} - Device pixel density
 */
export const getPixelDensity = () => {
  return PixelRatio.get();
};

/**
 * Convert dp to px
 * @param {number} dp - Density-independent pixels
 * @returns {number} - Pixels
 */
export const dpToPx = (dp) => {
  return PixelRatio.getPixelSizeForLayoutSize(dp);
};

/**
 * Convert px to dp
 * @param {number} px - Pixels
 * @returns {number} - Density-independent pixels
 */
export const pxToDp = (px) => {
  return PixelRatio.roundToNearestPixel(px);
};

// Responsive font sizing with additional control
export const responsiveFontSize = (size, factor = 0.5) => {
  return RFValue(moderateScale(size, factor));
};

// Responsive image dimensions
export const responsiveImageDimensions = (baseWidth, baseHeight, widthPercent = 0.2) => {
  const calculatedWidth = SCREEN_WIDTH * widthPercent;
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