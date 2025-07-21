// src/components/GradientLayout.js
import React from 'react';
import  LinearGradient from 'react-native-linear-gradient';

const GradientLayout = ({ children }) => {
  return (
    <LinearGradient
      colors={['#007AFF', '#E6F0FF']}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientLayout;
