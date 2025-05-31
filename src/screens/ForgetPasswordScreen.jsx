import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import phone_icon from '../../assets/phone_icon.png';
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import GradientLayout from '../component/GradientLayout';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import ApiService from '../services/authService';
import CustomButton from '../component/button';
import { useNavigation } from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../utils/responsive';

const ForgetPasswordScreen = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const sendOtp = async () => {
    setLoading(true);
    try {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        setLoading(false);
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const locationStr = `${location.coords.latitude},${location.coords.longitude}`;

      const payload = {
        MobileNo: phone,
        Version: Constants?.expoConfig?.version?.split('.')[0],
        IP: Device.osInternalBuildId,
        Location: locationStr,
      }
      console.log(payload);
      const response = await ApiService.resendOTP(
        payload.MobileNo,
        payload.Version,
        payload.IP,
        payload.Location
      );
      console.log(response.data);
      if (response.data.Error === "0") {
        Alert.alert('OTP Sent', response.data.Message);
        navigation.navigate('OtpVerify', {
          MobileNo: phone,
          Version: Constants?.expoConfig?.version?.split('.')[0],
          IP: Device.osInternalBuildId,
          Location: locationStr,
        });
      } else {
        Alert.alert('Error', response.data.Message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <GradientLayout>
      <SafeAreaView className="flex-1 justify-between items-center p-6 mt-9">

{/* TOP SECTION */}
<View className="w-full items-center mt-12">
  <Image source={logo} className="w-29 h-25 mb-4" />
  <Text className="text-xl font-bold mb-4">Send OTP</Text>

  <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
    <Image source={phone_icon} className="w-7 h-7 mr-6" />
    <TextInput
      placeholder="Mobile Number"
      placeholderTextColor="#888"
      className="flex-1 text-gray-900 font-bold text-lg"
      value={phone}
      onChangeText={setPhone}
      keyboardType="phone-pad"
    />
  </View>

  <CustomButton
    title={loading ? 'Sending OTP...' : 'Send OTP'}
    onPress={sendOtp}
    disabled={loading}
  />
</View>

{/* BOTTOM SECTION */}
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: verticalScale(12),
  }}
>
  {/* Left: Live Chat + Talk to Us */}
  <View
    style={{
      flexDirection: 'row',
      width: '50%',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}
  >
    <View style={{ alignItems: 'center' }}>
      <Image
        source={live_chat}
        style={{
          width: horizontalScale(44),
          height: verticalScale(44),
          marginBottom: verticalScale(4),
        }}
      />
      <Text style={{ fontSize: moderateScale(12) }}>Live Chat</Text>
    </View>
    <View style={{ alignItems: 'center' }}>
      <Image
        source={talk_to_us}
        style={{
          width: horizontalScale(44),
          height: verticalScale(40),
          marginBottom: verticalScale(4),
        }}
      />
      <Text style={{ fontSize: moderateScale(12) }}>Talk to Us</Text>
    </View>
  </View>

  {/* Right: Logo */}
  <View
    style={{
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Image
      source={logo}
      style={{
        width: horizontalScale(90),
        height: verticalScale(40),
        resizeMode: 'contain',
      }}
    />
  </View>
</View>
</SafeAreaView>

    </GradientLayout>
  );
};

export default ForgetPasswordScreen;
