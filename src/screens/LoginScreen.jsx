import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import logo from '../../assets/logo.png';
import phone_icon from '../../assets/phone_icon.png';
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import { useNavigation } from '@react-navigation/native';
import GradientLayout from '../component/GradientLayout';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import ApiService from '../services/authService';
import { UserContext } from '../context/UserContext';
import CustomButton from '../component/button';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const { saveUserData, userData } = useContext(UserContext);

  useEffect(() => {
    const checkLogin = async () => {
      if (userData.tokenid) {
        navigation.navigate('TabRouter');
      }
    };
    checkLogin();
  }, [userData.tokenid]);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    setLoading(true);

    try {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        setLoading(false);
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const locationStr = `${location.coords.latitude},${location.coords.longitude}`;

      // IMEI & FireToken (dummy for now)
      const imei = Device.osInternalBuildId || 'dummy-imei';
      const fireToken = 'dummy-token';

      // Prepare payload
      const payload = {
        Name: phone,
        Pass: password,
        IMEI: imei,
        FireToken: fireToken,
        Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
        Location: locationStr,
      };

      const response = await ApiService.login(
        payload.Name,
        payload.Pass,
        payload.Version,
        payload.IMEI,
        payload.FireToken,
        payload.Location
      );
      console.log(response.data);
      const { ERROR, MESSAGE, TOKENID, OTPCheck, SHOPNAME, EMAIL, USERTYPE, MOBILENUMBER } = response.data;

      if (ERROR === '0') {
        if (OTPCheck === 'false') {
          Alert.alert('OTP Required', 'Please complete OTP verification.');
        } else {
          const userObject = {
            tokenid: TOKENID,
            username: SHOPNAME,
            email: EMAIL,
            usertype: USERTYPE,
            shopname: SHOPNAME,
            mobilenumber: MOBILENUMBER
          };
          await saveUserData({
            ...userData,
            tokenid: TOKENID,
            username: SHOPNAME,
            email: EMAIL,
            usertype: USERTYPE,
            shopname: SHOPNAME,
            mobilenumber: MOBILENUMBER
          });
          Alert.alert('Success', MESSAGE);
          navigation.navigate('TabRouter');
        }
      } else {
        Alert.alert('Login Failed', MESSAGE);
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientLayout>
      <SafeAreaView className="flex-1 justify-between items-center p-6 mt-9">
        {/* Top Section */}
        <View className="w-full items-center mt-12">
          <Image source={logo} className="w-29 h-25 mb-4" />
          <Text className="text-xl font-bold mb-4">Login</Text>

          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <Image source={phone_icon} className="w-7 h-7 mr-6" />
            <TextInput
              placeholder="Mobile Number or Email"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg"
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons
                name={secureText ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <CustomButton
            title={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            disabled={loading}
          />
          <View className="w-full mt-4">
            <CustomButton title='Register' navigateTo='RegisterScreen'/>
          </View>
        </View>
        {/* Bottom Icons */}
        <View className="flex-row justify-between items-end w-full mb-3">
          <View className="flex-row w-1/2 h-full justify-around items-center">
            <View className="items-center">
              <Image source={live_chat} className="w-11 h-11 mb-1" />
              <Text className="text-xs">Live Chat</Text>
            </View>
            <View className="items-center">
              <Image source={talk_to_us} className="w-11 h-10 mb-1" />
              <Text className="text-xs">Talk to Us</Text>
            </View>
          </View>

          <View className="w-1/2 items-center justify-center">
            <Image source={logo} style={{ width: 90, height: 40 }} />
          </View>
        </View>
        <View>
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default LoginScreen;
