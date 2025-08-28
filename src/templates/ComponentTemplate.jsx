/**
 * Component Documentation Template
 * 
 * Use this template for documenting components in a consistent way.
 * Copy this template when creating new components or refactoring existing ones.
 */

/**
 * @componentName - Brief description of what the component does
 * 
 * @description
 * Detailed description of the component's purpose, behavior, and any important
 * implementation details that developers should know.
 * 
 * @example
 * ```jsx
 * import ComponentName from './path/to/ComponentName';
 * 
 * const MyComponent = () => (
 *   <ComponentName
 *     propName="value"
 *     anotherProp={123}
 *     onSomething={() => console.log('Something happened')}
 *   />
 * );
 * ```
 * 
 * @param {Object} props - Component props
 * @param {string} props.propName - Description of propName
 * @param {number} props.anotherProp - Description of anotherProp
 * @param {Function} props.onSomething - Callback triggered when something happens
 * @param {ReactNode} [props.children] - Optional children to render inside the component
 * 
 * @returns {React.ReactElement} Description of what is rendered
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/layout';

const ComponentName = ({ 
  propName, 
  anotherProp,
  onSomething,
  children 
}) => {
  // Component logic here
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{propName}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.M,
    backgroundColor: COLORS.BACKGROUND,
  },
  text: {
    color: COLORS.TEXT,
  },
});

export default ComponentName;
