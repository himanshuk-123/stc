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
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../component/button';
import GradientLayout from '../component/GradientLayout';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import ApiService from '../services/authService';
import Header from '../component/Header';
import { useSelector } from 'react-redux';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setnewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [secureCurrentPass, setSecureCurrentPass] = useState(true);
  const [secureNewPass, setSecureNewPass] = useState(true);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Use Redux selector instead of UserContext
  const userData = useSelector(state => state.user);

  const handleChangePassword = async () => {
    // Validate inputs
    if (!oldPin || !newPin || !confirmPin) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return; 
    }

    setLoading(true);

    try {
      // Get current location for API payload
      
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
        TokenID: userData.tokenid,
        OldPin: oldPin,
        NewPin: newPin,
        Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
      };
      console.log(payload);
      const response = await ApiService.changePin(
        payload.TokenID,
        payload.OldPin,
        payload.NewPin,
        payload.Version
      );      
      console.log("himanshu response: ",response.data);
      if(response.data.Error === "0"){
        Alert.alert('Success', response.data.Message);
        navigation.goBack();
      }else{
        Alert.alert('Try Again', response.data.Message);
      }
    } catch (error) {
      console.error('Password change error:', error);
      Alert.alert('Error', 'Failed to change Pin. Please try again.');
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <GradientLayout>
      <SafeAreaView className="flex-1 justify-between items-center p-4">
        <Header headingTitle="Change Pin" />
        
        {/* Password Inputs Section */}
        <View className="w-full items-center">
          <Image source={logo} />
          <Text className="text-xl font-bold mb-4">Change Your Pin</Text>

          {/* Current Password */}
          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <Ionicons name="lock-closed" size={24} color="#11458a" />
            <TextInput
              placeholder="Old Pin"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg ml-3"
              secureTextEntry={secureCurrentPass}
              value={oldPin}
              onChangeText={setOldPin}
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity onPress={() => setSecureCurrentPass(!secureCurrentPass)}>
              <Ionicons
                name={secureCurrentPass ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <Ionicons name="lock-closed" size={24} color="#11458a" />
            <TextInput
              placeholder="New Pin"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg ml-3"
              secureTextEntry={secureNewPass}
              value={newPin}
              onChangeText={setnewPin}
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity onPress={() => setSecureNewPass(!secureNewPass)}>
              <Ionicons
                name={secureNewPass ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <Ionicons name="lock-closed" size={24} color="#11458a" />
            <TextInput
              placeholder="Confirm New Pin"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg ml-3"
              secureTextEntry={secureConfirmPass}
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity onPress={() => setSecureConfirmPass(!secureConfirmPass)}>
              <Ionicons
                name={secureConfirmPass ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <CustomButton
            title={loading ? 'Changing Pin...' : 'Change Pin'}
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

export default ChangePasswordScreen;
