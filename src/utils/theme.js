/**
 * App theme constants
 */

export const COLORS = {
  primary: '#6c5ce7',
  primaryLight: '#a29bfe',
  secondary: 'blue',
  accent: 'purple',
  background: '#fff',
  text: '#000',
  textLight: '#555',
  textSecondary: '#fff',
  success: 'green',
  border: '#f1f2f6',
  borderDark: '#ccc',
  error: 'red',
  card: '#ffffff',
  shadow: '#000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const BORDERS = {
  radius: {
    sm: 5,
    md: 10,
    lg: 20,
    xl: 30,
  },
  width: {
    thin: 0.5,
    regular: 1,
    thick: 1.5,
    extraThick: 2,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
};
