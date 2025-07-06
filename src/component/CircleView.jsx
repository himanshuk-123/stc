import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const CircleView = ({ size = 100, backgroundColor = '#ccc', children,onPress }) => {
  return (
    <TouchableOpacity onPress = {onPress}
    
      style={[
      styles.circle,
      {
        height: size,
        width: size,
        borderRadius: size / 2,
        backgroundColor,
      }
    ]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircleView;
