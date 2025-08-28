/**
 * Layout constants for borders, shadows, and other styling elements
 */
import { COLORS } from './colors';

export const BORDERS = {
  radius: {
    none: 0,
    xs: 2,
    sm: 5,
    md: 10,
    lg: 20,
    xl: 30,
    full: 999,
  },
  width: {
    none: 0,
    thin: 0.5,
    regular: 1,
    thick: 1.5,
    extraThick: 2,
  },
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
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

export const LAYOUT = {
  zIndex: {
    base: 0,
    content: 1,
    header: 10,
    modal: 100,
    tooltip: 1000,
  },
};
