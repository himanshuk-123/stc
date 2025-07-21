import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard 
} from 'react-native';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import { Picker } from '@react-native-picker/picker';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/responsive';
import CustomButton from '../component/button';
import RegisterService from '../services/registerService';
import { useAppSelector } from '../redux/hooks';
import { logout } from '../utils/authUtils';
import eye from '../../assets/eye.png'
import eye_off from '../../assets/eyeOff.png'
const AddUserScreen = () => {
  const [userType, setUserType] = useState(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopname, setShopName] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const userData = useAppSelector((state) => state.user);

  const onSubmit = async () => {
    if (!userType || !name || !mobile || !email || !password) {
      return Alert.alert('Error', 'Please fill all fields and select user type.');
    }

    const payload = {
      Tokenid: userData.tokenid,
      MobileNo: mobile,
      EmailID: email,
      Password: password,
      ShopName: shopname,
      Name: name,
      Type: userType,
      Version: '1',
    };

    try {
      const response = await RegisterService.AddMember(
        payload.Tokenid,
        payload.MobileNo,
        payload.EmailID,
        payload.Password,
        payload.ShopName,
        payload.Name,
        payload.Type,
        payload.Version
      );
      console.log('User added successfully:', payload);
      console.log('Response:', response.data);
      Alert.alert('',response.data.Message,[
        {
          text: 'OK',
          onPress: () => {
            navigate.goback();
          }
        }
      ]);
      if (response.data.Error === '9') {
        logout();
      }
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user. Please try again.');
    }
  };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <Header headingTitle="Add User" />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            {/* User Image */}
            <Image
              source={require('../../assets/AddUser.png')}
              style={styles.avatar}
            />

            {/* Dropdown */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={userType}
                onValueChange={(val) => setUserType(val)}
                style={styles.picker}
                dropdownIconColor="#03a5fc"
              >
                <Picker.Item label="Select user type" value={null} />
                <Picker.Item label="FOS" value={6} />
                <Picker.Item label="Retailer" value={7} />
              </Picker>
            </View>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={{fontSize:20}}>👤</Text>
              <TextInput
                placeholder="Enter name"
                style={styles.input}
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                maxLength={30}
              />
            </View>

            {/* Mobile Input */}
            <View style={styles.inputContainer}>
              <Text style={{fontSize:20}}>📱</Text>
              <TextInput
                placeholder="Enter mobile number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                style={styles.input}
                placeholderTextColor="#888"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={{fontSize:20}}>📧</Text>
              <TextInput
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                placeholderTextColor="#888"
              />
            </View>

            {/* Shop Name Input */}
            <View style={styles.inputContainer}>
              <Text style={{fontSize:20}}>🏢</Text>
              <TextInput
                placeholder="Enter Shop Name"
                value={shopname}
                onChangeText={setShopName}
                style={styles.input}
                placeholderTextColor="#888"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={{fontSize:20}}>🔒</Text>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={securePassword}
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
                <Image source={securePassword ? eye : eye_off} style={{width:24,height:24}}/>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <View style={styles.button}>
              <CustomButton title="Submit" onPress={onSubmit} />
            </View>
          </View>
         </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default AddUserScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(16),
  },
  contentContainer: {
    padding: moderateScale(7),
    alignItems: 'center',
  },
  avatar: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(20),
  },
  pickerWrapper: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
    height: 50,
  },
  picker: {
    width: '100%',
    height: verticalScale(44),
    color: 'black',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: verticalScale(10),
    width: '100%',
  },
});
