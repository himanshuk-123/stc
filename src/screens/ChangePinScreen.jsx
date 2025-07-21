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
//import Constants from 'expo-constants';
import ApiService from '../services/authService';
import Header from '../component/Header';
import { useSelector, useDispatch } from 'react-redux';
import { horizontalScale, verticalScale } from '../utils/responsive';
import { handleCallPress } from '../component/Commonfunction';
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
  const dispatch = useDispatch();

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

      const payload = {
        TokenID: userData.tokenid,
        OldPin: oldPin,
        NewPin: newPin,
        Version: '1',
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
      <SafeAreaView style={styles.container}>
        <Header headingTitle="Change Pin" />
        <View style={{flex: 1,justifyContent: 'space-between',alignItems: 'center'}}>
        <View style={styles.contentContainer}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Change Your Pin</Text>

          <View style={styles.inputContainer}>
            <Text style={{fontSize:20}}>🔒</Text>
            <TextInput
              placeholder="Old Pin"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry={secureCurrentPass}
              value={oldPin}
              onChangeText={setOldPin}
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity onPress={() => setSecureCurrentPass(!secureCurrentPass)}>
              <Image source={secureCurrentPass ? eye : eye_off} style={{width:24,height:24}}/>
              
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={{fontSize:20}}>🔒</Text>
            <TextInput
              placeholder="New Pin"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry={secureNewPass}
              value={newPin}
              onChangeText={setnewPin}
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity onPress={() => setSecureNewPass(!secureNewPass)}>
              <Image source={secureNewPass ? eye : eye_off} style={{width:24,height:24}}/>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={{fontSize:20}}>🔒</Text>
            <TextInput
              placeholder="Confirm New Pin"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry={secureConfirmPass}
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity onPress={() => setSecureConfirmPass(!secureConfirmPass)}>
              <Image source={secureConfirmPass ? eye : eye_off} style={{width:24,height:24}}/>
            </TouchableOpacity>
          </View>

          <CustomButton
            title={loading ? 'Changing Pin...' : 'Change Pin'}
            onPress={handleChangePassword}
            disabled={loading}
          />
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
    width: horizontalScale(230),
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
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
