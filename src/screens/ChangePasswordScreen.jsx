import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../component/button';
import GradientLayout from '../component/GradientLayout';
import eye from '../../assets/eye.png'
import eye_off from '../../assets/eyeOff.png'
// import * as Location from 'expo-location';
// import Constants from 'expo-constants';
import ApiService from '../services/authService';
import Header from '../component/Header';
import { useSelector } from 'react-redux';
import { horizontalScale, verticalScale } from '../utils/responsive';
import { handleCallPress } from '../component/Commonfunction';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureCurrentPass, setSecureCurrentPass] = useState(true);
  const [secureNewPass, setSecureNewPass] = useState(true);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Use Redux selector instead of UserContext
  const userData = useSelector(state => state.user);

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

      const payload = {
        TokenID: userData.tokenid,
        Password: newPassword,
        OldPassword: currentPassword,
        Version: '1',
      };
      console.log(payload);
      const response = await ApiService.changePassword(
        payload.TokenID,
        payload.Password,
        payload.OldPassword,
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
      Alert.alert('Error', 'Failed to change password. Please try again.');
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <GradientLayout>
    <SafeAreaView style={styles.container}>
        <Header headingTitle="Change Password" style={{marginLeft: 10,marginTop: 10}}/>
        <View style={{flex: 1,justifyContent: 'space-between',alignItems: 'center'}}>
      <View style={styles.contentContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Change Your Password</Text>

        <View style={styles.inputContainer}>
        <Text style={{fontSize:20}}>🔒</Text>
          <TextInput
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!secureCurrentPass}
            style={styles.input}
            placeholderTextColor="gray"
          />
          <TouchableOpacity onPress={() => setSecureCurrentPass(!secureCurrentPass)}>
          <Image source={secureCurrentPass ? eye : eye_off} style={{width:24,height:24}}/>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
        <Text style={{fontSize:20}}>🔒</Text>
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!secureNewPass}
            style={styles.input}
            placeholderTextColor="gray"
          />
          <TouchableOpacity onPress={() => setSecureNewPass(!secureNewPass)}>
            <Image source={secureNewPass ? eye : eye_off} style={{width:24,height:24}}/>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
        <Text style={{fontSize:20}}>🔒</Text>
          <TextInput
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!secureConfirmPass}
            style={styles.input}
            placeholderTextColor="gray"
          />
          <TouchableOpacity onPress={() => setSecureConfirmPass(!secureConfirmPass)}>
            <Image source={secureConfirmPass ? eye : eye_off} style={{width:24,height:24}}/>
          </TouchableOpacity>
        </View>

        <CustomButton title={loading ? 'Loading...' : 'Change Password'} onPress={handleChangePassword} />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.footerItem}>
            <Image source={live_chat} style={styles.footerIcon} />
            <Text style={styles.footerText}>Live Chat</Text>
          </View>
          <TouchableOpacity onPress={handleCallPress}>
          <View style={styles.footerItem}>
            <Image source={talk_to_us} style={styles.footerIcon} />
            <Text style={styles.footerText}>Talk to Us</Text>
          </View>
          </TouchableOpacity>
        </View>
        <View style={styles.footerRight}>
          <Image source={logo} style={{ width: 90, height: 40 }} />
        </View>
        </View>
      </View>
    </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: horizontalScale(250),
    height: verticalScale(100),
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 4,
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#111827',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 12,
  },
  footerLeft: {
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerRight: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerIcon: {
    width: 44,
    height: 44,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: 'black'
  },
});

export default ChangePasswordScreen;
