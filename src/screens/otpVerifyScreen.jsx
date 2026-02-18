import {
    View,
    Text,
    Image,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Platform
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import logo from '../../assets/logo.png';
  import live_chat from '../../assets/live_chat.png';
  import talk_to_us from '../../assets/talk_to_us.png';
  import { useNavigation } from '@react-navigation/native';
  import CustomButton from '../component/button'    ;
  import GradientLayout from '../component/GradientLayout';
  import Header from '../component/Header';   
import RegisterService from '../services/registerService';
  
  const OtpVerifyScreen = ({route}) => {
    const {object,id} = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const handleChangePassword = async () => {
         setLoading(true);
      try {
        const payload = {
        ID: id,
        MobileNo: object.MobileNo,
        EmailID: object.EmailID,
        State: object.State,
        Pincode: object.Pincode,
        Name: object.Name,
        Address: object.Address,
        MobileOTP: otp,
        MailOTP: "",
        Version:  Platform.OS === "android" ? Platform.Version : "1",
        Location: object.Location,
        };
        console.log("himanshu payload: ",payload);
        console.log(payload.ID);
        const response = await RegisterService.registeration(
          payload.ID,
          payload.MobileNo, 
          payload.EmailID,
          payload.State,  
          payload.Pincode,
          payload.Name,
          payload.Address,
          payload.MobileOTP,
          payload.MailOTP,
          payload.Version,  
          payload.Location
        );
        console.log("himanshu response: ",response.data);
        if(response.data.Error === "0"){
          Alert.alert('Success', response.data.Message);
          navigation.replace('Login');
        }else{
          Alert.alert('Error', response.data.Message);
        }
      } catch (error) {
        console.error('Password change error:', error);
         }
      finally{
        setLoading(false);
      }
    };
  
    // useEffect(() => {
    //   console.log("himanshu payload: ",object);
    //   console.log("himanshu id: ",id);  
    // }, []);

    return (
      <GradientLayout>
        <SafeAreaView style={styles.container}>
          <Header headingTitle="Verify OTP" />
          
          {/* Password Inputs Section */}
          <View style={{flex:1,justifyContent:'space-between',alignItems:'center'}}>
          <View style={styles.inputSection}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Verify Your OTP</Text>
  
            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="#888"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
              />
            </View>

            {/* <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Confirm Password"
                placeholderTextColor="#888"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View> */}
  
            <CustomButton
              title={loading ? 'Verifying OTP...' : 'Verify OTP'}
              onPress={handleChangePassword}
              disabled={loading}
            />
          </View>
  
          {/* Bottom Icons */}
          <View style={styles.bottomContainer}>
            <View style={styles.bottomLeftContainer}>
              <View style={styles.iconContainer}>
                <Image source={live_chat} style={styles.icon} />
                <Text style={styles.iconText}>Live Chat</Text>
              </View>
              <View style={styles.iconContainer}>
                <Image source={talk_to_us} style={styles.icon} />
                <Text style={styles.iconText}>Talk to Us</Text>
              </View>
            </View>
  
            <View style={styles.bottomRightContainer}>
              <Image source={logo} style={styles.bottomLogo} />
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
      padding: 16
    },
    inputSection: {
      width: '100%',
      alignItems: 'center',
      marginTop: 16
    },
    logo: {
      width: 190,
      height: 85,
      marginBottom: 16
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 9999,
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
      marginLeft: 12
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
      marginBottom: 12
    },
    bottomLeftContainer: {
      flexDirection: 'row',
      width: '50%',
      height: '100%',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    iconContainer: {
      alignItems: 'center'
    },
    icon: {
      width: 44,
      height: 44,
      marginBottom: 4
    },
    iconText: {
      fontSize: 12,
      color: 'black'
    },
    bottomRightContainer: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bottomLogo: {
      width: 90,
      height: 40
    }
  });
  
  export default OtpVerifyScreen;