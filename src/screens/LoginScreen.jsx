import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/logo.png';
import phn from '../../assets/phone_icon.png';
import GradientLayout from '../component/GradientLayout';
import Geolocation from 'react-native-geolocation-service';
import ApiService from '../services/authService';
import CustomButton from '../component/button';
import { useAppDispatch } from '../redux/hooks';
import { saveUserData } from '../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../utils/responsive';
import { useIsFocused } from '@react-navigation/native';
import { handleCallPress } from '../component/Commonfunction';
import { useNavigation } from '@react-navigation/native';
import eye from '../../assets/eye.png';
import eye_off from '../../assets/eyeOff.png';
import check from '../../assets/check.png';
import BottomSection from '../component/BottomSection';
const LoginScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function requestNotificationPermission() {
    if (Platform.OS === 'android') {
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return res === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const authStatus = await messaging().requestPermission();
      return !!authStatus;
    }
  }

useEffect(() => {
  (async () => {
    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        if (token) {
          await sendTokenToBackend(token);
        }
      }
      const unsub = messaging().onTokenRefresh(newToken => sendTokenToBackend(newToken));
      // cleanup
      return () => unsub();
    } catch (err) {
      console.error('Notification init error', err);
    }
  })();
}, []);

// Function to send FCM token to backend
const sendTokenToBackend = async (token) => {
  // Store the token locally for now - will be sent with login
  try {
    await AsyncStorage.setItem('fcm_token', token);
    console.log('FCM token saved locally:', token);
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

  const isFocused = useIsFocused();
  // Use Redux custom hooks
  const dispatch = useAppDispatch();

const saveCredentialsSecure = async (phoneNumber, pwd, remember) => {
  try {
    if (remember) {
      // Secure storage - username is the phoneNumber, password is the pwd
      console.log('Saving credentials to keychain for:', phoneNumber);
      await Keychain.setGenericPassword(phoneNumber, pwd);
      // Store a flag in AsyncStorage to indicate remember me is active
      await AsyncStorage.setItem('remember_me', 'true');
    } else {
      // If not remember, clear stored credentials
      console.log('Clearing saved credentials from keychain');
      await Keychain.resetGenericPassword();
      await AsyncStorage.removeItem('remember_me');
    }
  } catch (e) {
    console.error('Error saving/clearing credentials:', e);
  }
};

  // Function to load saved credentials
const loadCredentialsSecure = async () => {
  try {
    const creds = await Keychain.getGenericPassword();
    if (creds) {
      console.log('Loaded credentials from keychain', creds.username);
      setPhone(creds.username);
      setPassword(creds.password);
      setRememberMe(true);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error loading credentials from keychain:', e);
    return false;
  }
};

  useEffect(() => {
    // Load saved credentials when component mounts or is focused
    if (isFocused) {
      loadCredentialsSecure();
    }
  }, [isFocused]);

  useEffect(() => {
    const requestPermissions = async () => {
      if (!isFocused) return;

      try {
        if (Platform.OS === 'android') {
          const cameraStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          const contactsStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          );
          const locationStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (cameraStatus !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Required',
              'Please enable Camera permission for QR scan.',
            );
          }

          if (contactsStatus !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Required',
              'Please enable Contacts permission to use contact features.',
            );
          }

          if (locationStatus !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Required',
              'Please enable Location permission to use location features.',
            );
          }
        } else {
          // iOS permissions
          // For iOS, we use different methods for permissions
          try {
            // Location permissions are handled by Geolocation.requestAuthorization() in iOS
            await Geolocation.requestAuthorization('whenInUse');
            
            // Camera and Contact permissions would typically use the react-native-permissions library
            // But for simplicity, we'll just log this
            console.log('On iOS, camera and contacts permissions are typically handled at usage time');
          } catch (error) {
            console.warn('iOS permission error:', error);
          }
        }
      } catch (error) {
        console.warn('Permission error:', error);
      }
    };

    requestPermissions();
  }, [isFocused]);

  const getLocation = () => {
    return new Promise((resolve) => {
      const locationOptions = { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000,
        forceRequestLocation: true // This forces a fresh location request
      };

      console.log('Attempting to get current location...');
      
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          console.log('Location obtained successfully:', locationString);
          resolve(locationString);
        },
        error => {
          console.log('Location fetch error:', error);
          
          // If high accuracy fails, try with lower accuracy as fallback
          if (error.code === 3) { // TIMEOUT
            console.log('Retrying with lower accuracy...');
            Geolocation.getCurrentPosition(
              fallbackPosition => {
                const { latitude, longitude } = fallbackPosition.coords;
                const locationString = `${latitude},${longitude}`;
                console.log('Location obtained with lower accuracy:', locationString);
                resolve(locationString);
              },
              fallbackError => {
                console.log('Fallback location fetch also failed:', fallbackError);
                resolve(null);
              },
              { ...locationOptions, enableHighAccuracy: false, timeout: 10000 }
            );
          } else {
            resolve(null);
          }
        },
        locationOptions
      );
    });
  };

const handleLogin = async () => {
  setPhoneError('');
  setPasswordError('');

  let isValid = true;

  if (!phone.trim()) {
    setPhoneError('Please enter your mobile number');
    isValid = false;
  } else if (!/^\d{10}$/.test(phone.trim())) {
    setPhoneError('Please enter a valid 10 digit mobile number');
    isValid = false;
  }

  if (!password) {
    setPasswordError('Please enter your password');
    isValid = false;
  } else if (password.length < 6) {
    setPasswordError('Password must be at least 6 characters');
    isValid = false;
  }

  if (!isValid) return;

  setLoading(true);

  try {
    const fireToken = await AsyncStorage.getItem('fcm_token');

    // ✅ IMEI ka alternative
    const androidId = await DeviceInfo.getAndroidId(); // async
    const uniqueId = DeviceInfo.getUniqueId(); // sync
    const appVersion = DeviceInfo.getVersion(); // app version
    const osVersion = Platform.Version.toString();

    let locationStr = null;
    if (Platform.OS === 'android') {
      const locationStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (locationStatus) {
        locationStr = await getLocation();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          locationStr = await getLocation();
        } else {
          Alert.alert(
            'Location Access',
            'Location access helps us provide better service.'
          );
        }
      }
    } else if (Platform.OS === 'ios') {
      try {
        await Geolocation.requestAuthorization('whenInUse');
        locationStr = await getLocation();
      } catch (error) {
        console.log('iOS location error:', error);
      }
    }

    const payload = {
      Name: phone.trim(),
      Pass: password,
      IMEI: androidId, // ✅ safe alternative
      FireToken: fireToken ,
      Version: osVersion,
      Location: locationStr || null,
    };

    console.log('Login payload:', payload);

    const response = await ApiService.login(
      payload.Name,
      payload.Pass,
      payload.Version,
      payload.IMEI,
      payload.FireToken,
      payload.Location,
    );

    const {
      ERROR,
      MESSAGE,
      TOKENID,
      OTPCheck,
      SHOPNAME,
      EMAIL,
      USERTYPE,
      MOBILENUMBER,
      USERID,
    } = response.data;

    if (ERROR === '0') {
      // Save credentials only after successful login
      await saveCredentialsSecure(phone, password, rememberMe);
      
      if (OTPCheck === 'false') {
        Alert.alert('OTP Required', 'Please complete OTP verification.');
        navigation.navigate('OtpVerify');
      } else {
        const userObject = {
          tokenid: TOKENID,
          username: SHOPNAME,
          email: EMAIL,
          usertype: USERTYPE,
          shopname: SHOPNAME,
          mobilenumber: MOBILENUMBER,
          message: MESSAGE,
          userid: USERID,
          location: locationStr || null,
        };

        await dispatch(saveUserData(userObject));
      }
    } else {
      Alert.alert('Login Failed', MESSAGE || 'Authentication failed.');
    }
  } catch (error) {
    console.error('Login error:', error);

    let errorMsg = 'Failed to login. Please try again.';
    if (error.message?.includes('Network Error')) {
      errorMsg = 'Network error. Please check your internet connection.';
    } else if (error.response?.status === 401) {
      errorMsg = 'Invalid credentials. Please check your phone number and password.';
    } else if (error.response?.status === 429) {
      errorMsg = 'Too many login attempts. Please try again later.';
    } else if (error.response?.data?.MESSAGE) {
      errorMsg = error.response.data.MESSAGE;
    }

    Alert.alert('Login Error', errorMsg);
  } finally {
    setLoading(false);
  }
};


  // Load saved credentials when component mounts

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Image source={logo} style={styles.logoImage} />
          <Text style={styles.loginText}>Login</Text>

          <View style={styles.inputContainer}>
            <Image source={phn} style={styles.inputIcon} />
            <TextInput
              placeholder="Mobile Number or Email"
              placeholderTextColor="#888"
              style={styles.input}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setPhoneError('');
              }}
              keyboardType="phone-pad"
              maxLength={10}
              accessibilityLabel="Mobile number input field"
            />
          </View>
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

          <View style={styles.inputContainer}>
            <Text style={styles.lockIcon}>🔒</Text>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry={secureText}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              accessibilityLabel="Password input field"
            />
            <TouchableOpacity 
              onPress={() => setSecureText(!secureText)}
              accessibilityLabel={secureText ? "Show password" : "Hide password"}
            >
              <Image
                source={secureText ? eye : eye_off}
                style={styles.inputIcon}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Remember Me checkbox positioned to the left */}
          {/* ✅ Remember Me checkbox with label (fixed & accessible) */}
          <View style={styles.rememberMeContainer}>
            <TouchableOpacity
              style={[styles.checkbox, rememberMe && styles.checkedBox]}
              onPress={() => setRememberMe(prev => !prev)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              accessibilityLabel="Remember login credentials"
            >
              {rememberMe && (
                <Image source={check} style={styles.checkboxIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setRememberMe(prev => !prev)}>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            disabled={loading}
          />
          <View style={styles.registerContainer}>
            <CustomButton
              title="Register"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgetPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Icons */}
        <BottomSection />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    marginTop: 36,
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 48,
  },
  logoImage: {
    width: '100%',
    height: verticalScale(85),
    marginBottom: 16,
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'black'
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
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12,
  },
  registerContainer: {
    width: '100%',
    marginTop: 16,
  },
  forgotPassword: {
    marginTop: 12,
  },
  forgotPasswordText: {
    color: '#2563eb',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 12,
  },
  leftIconsContainer: {
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  chatIcon: {
    width: 44,
    height: 44,
    marginBottom: 4,
  },
  talkIcon: {
    width: 44,
    height: 40,
    marginBottom: 4,
  },
  iconText: {
    fontSize: 12,
    color: 'black',
  },
  rightLogoContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLogo: {
    width: 90,
    height: 40,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#03a5fc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: '#03a5fc', // Blue background when checked
  },
  rememberMeText: {
    fontSize: 14,
    color: '#333',
  },
  inputIcon: {
    width: 30,
    height: 30,
  },
  lockIcon: {
    fontSize: 30,
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
    marginTop: -10,
    marginBottom: 8,
    alignSelf: 'flex-start',
    fontSize: 12,
  },
  checkboxIcon: {
    width: 20,
    height: 20,
  }
});

export default LoginScreen;
