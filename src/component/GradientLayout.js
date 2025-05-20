// src/components/GradientLayout.js
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const GradientLayout = ({ children }) => {
  return (
    <LinearGradient
      colors={['#7ad6f0', '#ffffff']}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientLayout;
