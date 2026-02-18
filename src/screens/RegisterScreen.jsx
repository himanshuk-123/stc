  import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Platform
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import phone_icon from "../../assets/phone_icon.png";
import live_chat from "../../assets/live_chat.png";
import talk_to_us from "../../assets/talk_to_us.png";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../component/button";
import GradientLayout from "../component/GradientLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiService from "../services/authService";
import RegisterService from "../services/registerService";
import { Picker } from "@react-native-picker/picker";
import COMMON_SERVICE from "../services/commonServices";
import { saveUserData } from "../redux/slices/userSlice";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [states, setStates] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await COMMON_SERVICE.circleList();
        console.log("response states", response.data);
        if (response?.data?.Status === "1") {
          setStates(response.data.CircleList);
        } else {
          Alert.alert("Error", "Failed to fetch states.");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        Alert.alert("Error", "Unable to load states.");
      }
    };

    fetchStates();
  }, []);

  const validate = () => {
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      Alert.alert("Invalid Input", "Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid Input", "Please enter a valid email address.");
      return false;
    }
    if (!selectedStateId) {
      Alert.alert("Invalid Input", "Please select a state.");
      return false;
    }
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      Alert.alert("Invalid Input", "Please enter a valid 6-digit pincode.");
      return false;
    }
    if (!name) {
      Alert.alert("Invalid Input", "Please enter your name.");
      return false;
    }
    if (!address) {
      Alert.alert("Invalid Input", "Please enter your address.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    const osVersion = Platform.OS === "android" ?  Platform.Version.toString() : "1";
    try {
      const payload = {
        MobileNo: phone,
        EmailID: email,
        State: parseInt(selectedStateId),
        Pincode: parseInt(pincode),
        Name: name,
        Address: address,
        MobileOTP: "",
        MailOTP: "",
        Version: osVersion,
        Location: null,
      };

      console.log("Sending Payload:", JSON.stringify(payload));

      const response = await RegisterService.otpRequest(
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

      console.log("Register Response:", response.data);
      if(response.data.Error === '0'){
      navigation.navigate('OtpVerify', {object: payload,id: response.data.Time});
      }
      else{
        Alert.alert("Error",response.data.Message);
      }
    } catch (error) {
      console.error(
        "Himanshu bhai ka error: ",
        error.response?.data || error.message
      );
      Alert.alert("Network Error", "Try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.topSection}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Register</Text>

          <View style={styles.inputContainer}>
            <Image source={phone_icon} style={{width:30,height:30}}/>
            <TextInput
              placeholder="Mobile Number "
              placeholderTextColor="#888"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={{fontSize:30}}>📧</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStateId}
              onValueChange={(itemValue) => setSelectedStateId(itemValue)}
              dropdownIconColor="#000"
              style={styles.picker}
            >
              <Picker.Item label="Select State" value={null} />
              {states.map((state) => (
                <Picker.Item
                  key={state.Id}
                  label={state.CircleName}
                  value={state.Id}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={{fontSize:30}}>📍</Text>
            <TextInput
              placeholder="Pincode"
              placeholderTextColor="#888"
              style={styles.input}
              value={pincode}
              onChangeText={setPincode}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={{fontSize:30}}>👤</Text>
            <TextInput
              placeholder="Name"
              placeholderTextColor="#888"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={{fontSize:30}}>🏠</Text>
            <TextInput
              placeholder="Address"
              placeholderTextColor="#888"
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <CustomButton
            title={loading ? "Registering..." : "Register"}
            onPress={handleRegister}
            disabled={loading}
          />
        </View>

        {/* <View style={styles.bottomSection}>
          <View style={styles.bottomLeftSection}>
            <View style={styles.iconContainer}>
              <Image source={live_chat} style={styles.bottomIcon} />
              <Text style={styles.bottomText}>Live Chat</Text>
            </View>
            <View style={styles.iconContainer}>
              <Image source={talk_to_us} style={styles.bottomIcon} />
              <Text style={styles.bottomText}>Talk to Us</Text>
            </View>
          </View>

          <View style={styles.bottomRightSection}>
            <Image source={logo} style={styles.bottomLogo} />
          </View>
        </View> */}
      </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 48
  },
  logo: {
    width: '100%',
    height: 100,
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
  inputIcon: {
    width: 28,
    height: 28,
    marginRight: 24
  },
  input: {
    flex: 1,
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12
  },
  emailInput: {
    marginLeft: 20
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 9999,
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'white',
    paddingHorizontal: 20
  },
  picker: {
    color: '#000'
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 12
  },
  bottomLeftSection: {
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  iconContainer: {
    alignItems: 'center'
  },
  bottomIcon: {
    width: 44,
    height: 44,
    marginBottom: 4
  },
  bottomText: {
    fontSize: 12
  },
  bottomRightSection: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomLogo: {
    width: 90,
    height: 40
  }
});

export default RegisterScreen;
