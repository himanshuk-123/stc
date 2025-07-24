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
  import phone_icon from '../../assets/phone_icon.png';
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import GradientLayout from '../component/GradientLayout';
import ApiService from '../services/authService';
import CustomButton from '../component/button';
import { useNavigation } from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../utils/responsive';
import BottomSection from '../component/BottomSection';

const ForgetPasswordScreen = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const verifyOtp = async () => {
    setLoading(true);
    if(phone.length !== 10){
      Alert.alert('Error', 'Please enter a valid mobile number');
      setLoading(false);
      return;
    }
    try {
      const payload = {
        UserName: phone,
        OTP: otp,
        Password: '123456',
        Version: '1',
        IP: "",
        Location: null,
      }
      console.log(payload);
      const response = await ApiService.forgetPassword(
        payload.UserName,
        payload.OTP,
        payload.Password,
        payload.Version,
        payload.IP,
        payload.Location
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const sendOtp = async () => {
    setLoading(true);
    if(phone.length !== 10){
      Alert.alert('Error', 'Please enter a valid mobile number');
      setLoading(false);
      return;
    }
    try {
      const payload = {
        MobileNo: phone,
        Version: '1',
        IP: "",
        Location: null,
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
        setShowOtp(true);
        navigation.navigate('OtpVerify', {
          MobileNo: phone,
          Version: Constants?.expoConfig?.version?.split('.')[0],
          IP: "",
          Location: null,
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
      <SafeAreaView style={styles.container}>

        {/* TOP SECTION */}
        <View style={styles.topSection}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>{showOtp ? 'Verify OTP' : 'Send OTP'}</Text>

          <View style={styles.inputContainer}>
            <Image source={phone_icon} style={{width:30,height:30}}/>
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="#888"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {showOtp && (
            <View style={styles.inputContainer}>
              <Text style={{fontSize:30}}>🔒</Text>
              <TextInput
                placeholder="OTP"
                placeholderTextColor="#888"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          )}
          {showOtp && (
            <View style={styles.resendOtpContainer}>
            <TouchableOpacity onPress={sendOtp} style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize:30}}>🔄</Text>
              <Text style={styles.resendOtpText}>Resend OTP</Text>
            </TouchableOpacity>
            </View>
          )}
          <CustomButton
            title={loading ? 'Sending OTP...' : showOtp ? 'Verify OTP' : 'Send OTP'}
            onPress={showOtp ? verifyOtp : sendOtp}
            disabled={loading}
          />
        </View>

        {/* BOTTOM SECTION */}
        <BottomSection />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    marginTop: 36
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 48
  },
  logo: {
    width: 190,
    height: 85,
    marginBottom: 16
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
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 4,
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'white'
  },
  input: {
    flex: 1,
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: verticalScale(12)
  },
  bottomLeftContainer: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  iconContainer: {
    alignItems: 'center'
  },
  icon: {
    marginBottom: verticalScale(4)
  },
  iconText: {
    fontSize: moderateScale(12),
    color: 'black'
  },
  bottomRightContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomLogo: {
    width: horizontalScale(90),
    height: verticalScale(40),
    resizeMode: 'contain'
  },
  resendOtpContainer: {
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
  },
  resendOtpText: {
    color: '#11458a',
    fontSize: moderateScale(14),
    fontWeight: 'bold'
  },
  resendOtpIcon: {
    marginRight: 10
  }
});

export default ForgetPasswordScreen;
