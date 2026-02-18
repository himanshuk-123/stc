// src/components/GradientLayout.js
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const GradientLayout = ({ children }) => {
  // Option 1: Trustworthy Blue Scheme
  return (
    <LinearGradient
      colors={['#e3e9f7ff','#8092c9ff']}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientLayout;