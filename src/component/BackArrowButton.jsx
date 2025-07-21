import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import arrow from '../../assets/arrow-icon.png';
const BackArrowButton = ({ toScreen = null }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (toScreen) { 
      navigation.navigate(toScreen);
    } else {
      navigation.goBack(); // default: go back
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#7ad6f0', '#0b0866']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image source={arrow} style={{ width: 24, height: 24 }} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default BackArrowButton;
