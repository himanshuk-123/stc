import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { verticalScale, moderateScale } from '../utils/responsive';
const CustomButton = ({
  title = 'Login with OTP',
  colors = ['#329dc7', '#0b0866'],
  height = verticalScale(45),
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
          paddingVertical: verticalScale(12),
          justifyContent: 'center',
          alignItems: 'center',
          height,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.button}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    textAlign: 'center',
  },
});

export default CustomButton;
