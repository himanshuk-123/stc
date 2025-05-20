import {
    View,
    Text,
    Image,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import React, { useState, useContext } from 'react';
  import logo from '../../assets/logo.png';
  import live_chat from '../../assets/live_chat.png';
  import talk_to_us from '../../assets/talk_to_us.png';
  import { useNavigation } from '@react-navigation/native';
  import CustomButton from '../component/button';
  import GradientLayout from '../component/GradientLayout';
  import { Ionicons } from '@expo/vector-icons';
  import * as Location from 'expo-location';
  import Constants from 'expo-constants';
  import ApiService from '../services/authService';
  import { UserContext } from '../context/UserContext';
  import Header from '../component/Header';
  
  const OtpVerifyScreen = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureCurrentPass, setSecureCurrentPass] = useState(true);
    const [secureNewPass, setSecureNewPass] = useState(true);
    const [secureConfirmPass, setSecureConfirmPass] = useState(true);
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(UserContext);
  
    const handleChangePassword = async () => {
      // Validate inputs
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill all password fields');
        return;
      }
  
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New password and confirm password do not match');
        return; 
      }
  
      setLoading(true);
  
      try {
        // Get current location for API payload
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required');
          setLoading(false);
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const locationStr = `${location.coords.latitude},${location.coords.longitude}`;
  
        // This is a placeholder for the actual change password API call
        // Replace with your actual API call when available
        // setTimeout(() => {
        //    Simulate success response
        //   Alert.alert(
        //     'Success', 
        //     'Password changed successfully',
        //     [{ text: 'OK', onPress: () => navigation.goBack() }]
        //   );
        //   setLoading(false);
        // }, 1500);
  
        //Actual API call would look like this:
        const payload = {
          Tokenid: userData.tokenid,
          FormDate: null,
          ToDate: null,
          Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
          Location: null,
        };
        const response = await ApiService.changePassword(
          payload.Tokenid,
          payload.FormDate,
          payload.ToDate,
          payload.Version,
          payload.Location
        );
        
        console.log("himanshu response: ",response.data);
      } catch (error) {
        console.error('Password change error:', error);
        Alert.alert('Error', 'Failed to change password. Please try again.');
      }
      finally{
        setLoading(false);
      }
    };
  
    return (
      <GradientLayout>
        <SafeAreaView className="flex-1 justify-between items-center p-4">
          <Header headingTitle="Verify OTP" />
          
          {/* Password Inputs Section */}
          <View className="w-full items-center mt-4">
            <Image source={logo} className="w-29 h-25 mb-4" />
            <Text className="text-xl font-bold mb-4">Verify Your OTP</Text>
  
            
  
    
            {/* Confirm Password */}
            <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
              <Ionicons name="mail-outline" size={24} color="#11458a" />
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="#888"
                className="flex-1 text-gray-900 font-bold text-lg ml-3"
                secureTextEntry={secureConfirmPass}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
  
            <CustomButton
              title={loading ? 'Verifying OTP...' : 'Verify OTP'}
              onPress={handleChangePassword}
              disabled={loading}
            />
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
        </SafeAreaView>
      </GradientLayout>
    );
  };
  
  export default OtpVerifyScreen;
  