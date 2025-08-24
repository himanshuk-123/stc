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
  PermissionsAndroid
} from "react-native";
import React, { useState, useEffect } from 'react'
import logo from "../../assets/logo.png";
import phn from '../../assets/phone_icon.png'
import GradientLayout from "../component/GradientLayout";
import Geolocation from "react-native-geolocation-service";
import ApiService from "../services/authService";
import CustomButton from "../component/button";
import { useAppDispatch } from "../redux/hooks";
import { saveUserData } from "../redux/slices/userSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from "../utils/responsive";
import { useIsFocused } from "@react-navigation/native";
import { handleCallPress } from "../component/Commonfunction";
import { useNavigation } from '@react-navigation/native'
import eye from '../../assets/eye.png'
import eye_off from '../../assets/eyeOff.png'
import check from '../../assets/check.png'
import BottomSection from "../component/BottomSection";
const LoginScreen = () => {

  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isFocused = useIsFocused();
  // Use Redux custom hooks
  const dispatch = useAppDispatch();

  // Function to save credentials based on remember me choice
  const saveCredentials = async (phone, password, shouldRemember) => {
    try {
      if (shouldRemember) {
        // In a production app, consider using SecureStore instead for sensitive data
        await AsyncStorage.setItem('savedLogin', JSON.stringify({ phone, password, rememberMe: shouldRemember }));
      } else {
        await AsyncStorage.removeItem('savedLogin');
      }
    } catch (error) {
      console.error('Error handling credentials:', error);
    }
  };


  // Function to load saved credentials
  const loadCredentials = async () => {
    try {
      console.log("loadCredentials")
      const saved = await AsyncStorage.getItem('savedLogin');
      console.log('saved', saved);
      if (saved) {
        const { phone: savedPhone, password: savedPassword, rememberMe: savedRememberMe } = JSON.parse(saved);
        setPhone(savedPhone);
        setPassword(savedPassword);
        setRememberMe(savedRememberMe);
        return true;
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
      // Clear potentially corrupted data
      await AsyncStorage.removeItem('savedLogin');
    }
    return false;
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      if (!isFocused) return;

      try {
        if (Platform.OS === "android") {
          const cameraStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
          const contactsStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
          const locationStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

          if (cameraStatus !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              "Permission Required",
              "Please enable Camera permission for QR scan."
            );
          }

          if (contactsStatus !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              "Permission Required",
              "Please enable Contacts permission to use contact features."
            );
          }

          if (locationStatus !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              "Permission Required",
              "Please enable Location permission to use location features."
            );
          }

        } else {
          // iOS
          const cameraStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
          const contactsStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);

          if (cameraStatus !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              "Permission Required",
              "Please enable Camera permission for QR scan."
            );
          }

          if (contactsStatus !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              "Permission Required",
              "Please enable Contacts permission to use contact features."
            );
          }
        }
      } catch (error) {
        console.warn("Permission error:", error);
      }
    };

    requestPermissions();
  }, [isFocused]);

  const getLocation = () => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude},${longitude}`);
        },
        (error) => {
          console.log("Location fetch error:", error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
      );
    });
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter both phone number and password");
      return;
    }

    setLoading(true);

    let locationStr = null;

    try {
      if (Platform.OS === "android") {
        const locationStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (locationStatus === PermissionsAndroid.RESULTS.GRANTED) {
          locationStr = await getLocation(); // ✅ Corrected usage
        }
      }

      const imei = "dummy-imei";
      const fireToken = "dummy-token";
      const version = Platform.OS === "android" ? Platform.Version : "1";

      const payload = {
        Name: phone,
        Pass: password,
        IMEI: imei,
        FireToken: fireToken,
        Version: version,
        Location: locationStr || null,
      };

      console.log(payload);

      const response = await ApiService.login(
        payload.Name,
        payload.Pass,
        payload.Version,
        payload.IMEI,
        payload.FireToken,
        payload.Location
      );
      // Save or remove credentials based on rememberMe setting
      await saveCredentials(phone, password, rememberMe);

      // ✅ Continue same as your login success logic

      console.log(response.data);
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

      if (ERROR === "0") {
        if (OTPCheck === "false") {
          Alert.alert("OTP Required", "Please complete OTP verification.");
          navigation.navigate("OtpVerify");
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
            location: locationStr,
          };

          await dispatch(saveUserData(userObject));
          // RootNavigator will handle redirection
        }
      } else {
        Alert.alert("Login Failed", MESSAGE);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to login. Please try again.");
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
            <Image source={phn} style={{ width: 30, height: 30 }} />
            <TextInput
              placeholder="Mobile Number or Email"
              placeholderTextColor="#888"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={{ fontSize: 30 }}>🔒</Text>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Image source={secureText ? eye : eye_off} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
          </View>

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
              {rememberMe && <Image source={check} style={{ width: 20, height: 20 }} />}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setRememberMe(prev => !prev)}>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
          </View>


          <CustomButton
            title={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            disabled={loading}
          />
          <View style={styles.registerContainer}>
            <CustomButton
              title="Register"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgetPassword")}
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    marginTop: 36,
  },
  topSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 48,
  },
  logoImage: {
    width: '100%',
    height: verticalScale(85),
    marginBottom: 16,
  },
  loginText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 4,
    width: "100%",
    marginBottom: 16,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    color: "#111827",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 12,
  },
  registerContainer: {
    width: "100%",
    marginTop: 16,
  },
  forgotPassword: {
    marginTop: 12,
  },
  forgotPasswordText: {
    color: "#2563eb",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginBottom: 12,
  },
  leftIconsContainer: {
    flexDirection: "row",
    width: "50%",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
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
    color: 'black'
  },
  rightLogoContainer: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomLogo: {
    width: 90,
    height: 40,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#03a5fc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: "#03a5fc", // Blue background when checked
  },
  rememberMeText: {
    fontSize: 14,
    color: "#333",
  },
})

export default LoginScreen