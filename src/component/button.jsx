import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const CustomButton = ({
  title = 'Login with OTP',
  colors = ['#329dc7', '#0b0866'],
  height = 48,
  width = '100%',
  navigateTo = null,
  onPress,
  disabled = false
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigateTo) {
      navigation.navigate(navigateTo);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ borderRadius: 9999, overflow: 'hidden', width }}
      disabled={disabled}
    >
      <LinearGradient
        colors={colors}
        style={{
          paddingVertical: 12,
          justifyContent: 'center',
          alignItems: 'center',
          height,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-white font-bold text-center">{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;
