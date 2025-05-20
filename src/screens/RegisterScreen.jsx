import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import logo from "../../assets/logo.png";
import phone_icon from "../../assets/phone_icon.png";
import live_chat from "../../assets/live_chat.png";
import talk_to_us from "../../assets/talk_to_us.png";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../component/button";
import GradientLayout from "../component/GradientLayout";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Device from "expo-device";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiService from "../services/authService";
import { UserContext } from "../context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RegisterService from "../services/registerService";
import { Picker } from "@react-native-picker/picker";
import COMMON_SERVICE from'../services/commonServices';
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
  const { saveUserData } = useContext(UserContext);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await COMMON_SERVICE.circleList(); // Ensure this returns the expected object
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

  const handleRegister = async () => {
    setLoading(true);

    try {
      //Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required");
        setLoading(false);
        return;
      }

      //Get current location
      let location = await Location.getCurrentPositionAsync({});
      const locationStr = `${location.coords.latitude},${location.coords.longitude}`;

      // Prepare payload
      const payload = {
        MobileNo: phone,
        EmailID: email,
        State: parseInt(selectedStateId), // 🟢 Dynamically set selected ID
        Pincode: parseInt(pincode),
        Name: name,
        Address: address,
        MobileOTP: "",
        MailOTP: "",
        Version: Constants?.expoConfig?.version?.split(".")[0] || "1",
        Location: locationStr,
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
      // Alert.alert(MESSAGE);
      console.log("Register Response:", response.data);
      const { Error, Message } = response.data;

      if (Error === "0") {
        Alert.alert(Message);
        // If registration returns user data, save it here
        // Example:
        // const userObject = {
        //   tokenid: response.data.TOKENID,
        //   username: response.data.SHOPNAME,
        //   email: response.data.EMAIL,
        //   usertype: response.data.USERTYPE,
        //   shopname: response.data.SHOPNAME,
        //   mobilenumber: response.data.MOBILENUMBER
        // };
        // await saveUserData(userObject);
      } else {
        Alert.alert("Login Failed", Message);
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
      <SafeAreaView className="flex-1 justify-between items-center p-6 mt-9">
        {/* Top Section */}
        <View className="w-full items-center mt-12">
          <Image source={logo} className="w-29 h-22 mb-4" />
          <Text className="text-xl font-bold mb-4">Register</Text>

          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <Image source={phone_icon} className="w-7 h-7 mr-6" />
            <TextInput
              placeholder="Mobile Number or Email"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <MaterialCommunityIcons name="email" size={26} color="#11458a" />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg ml-5"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="border rounded-full w-full mb-4 bg-white px-5">
            <Picker
              selectedValue={selectedStateId}
              onValueChange={(itemValue) => setSelectedStateId(itemValue)}
              dropdownIconColor="#000"
              style={{ color: "#000" }}
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
          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <TextInput
              placeholder="Pincode"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg"
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <TextInput
              placeholder="Name"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View className="flex-row items-center border rounded-full px-5 p-1 w-full mb-4 bg-white">
            <TextInput
              placeholder="Address"
              placeholderTextColor="#888"
              className="flex-1 text-gray-900 font-bold text-lg"
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

export default RegisterScreen;
