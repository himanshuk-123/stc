import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, FlatList, Modal, Text, TouchableOpacity, Dimensions, TextInput, Alert, ActivityIndicator } from 'react-native';
import Header from '../component/Header';
import SearchBar from '../component/SearchBar';
import Cards from '../component/cards';
import RechargeApiServices from '../services/RechargeService';
import Constants from 'expo-constants';
import GradientLayout from '../component/GradientLayout';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { logout } from '../utils/authUtils';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';


const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';

const MobileRechargeScreen = () => {
  const [services, setServices] = useState([]);
  const userData = useSelector(state => state.user);
  const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const mode = '1';

  // Calculate responsive dimensions
  const cardWidth = "90%";
  const cardHeight = verticalScale(80);

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const token = userData.tokenid;
      const payload = {
        Tokenid: token,
        mode: mode,
        Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
        Location: null,
      };
      console.log('Payload:', payload);

      const response = await RechargeApiServices.operator(
        payload.Tokenid,
        payload.mode,
        payload.Version,
        payload.Location
      );

      console.log('API Response:', response.data);
      const data = response.data;

      if (data.STATUSCODE !== '1') {
        setShowErrorModal(true);
        setErrorMessage("Authentication failed");
      }
      if (data.ERROR === '0') {
        const formattedData = data.Operator.map((item, index) => ({
          id: index.toString(),
          opcodenew: item.opcodenew,
          name: item.operatorname,
          image: IMAGE_BASE_URL + item.operator_img.replace(/^~\//, ''),
        }))
          ;

        setServices(formattedData);
      } else {
        console.log('API Error himanshu:', data.MESSAGE);
      }
    } catch (error) {
      console.log('API Error:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOperators();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{
      width: '33%',
      alignItems: 'center',
      marginVertical: verticalScale(8)
    }}>
      <Cards
        imageSource={{ uri: item.image }}
        title={item.name}
        height={cardHeight}
        width={cardWidth}
        imgheight={verticalScale(50)}
        imgwidth={horizontalScale(50)}
        gradientColors={['#ffffff', '#ffffff']}
        style={{ fontSize: moderateScale(12) }}
        onPress={() => navigation.navigate('CompanyRecharge', { operator: item, mode: mode, opcodenew: item.opcodenew })}
        cardsPerRow={3}
      />
    </View>
  );

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };

  const getOperatorCodeByName = (operatorName) => {
    const match = services.find(
      (item) => item.name.toLowerCase() === operatorName.toLowerCase()
    );
    return match ? match.opcodenew : null;
  };

  

  const onPhoneSubmit = async (number) => {
    try {
      const response = await axios.get(`https://onlinerechargeservice.in/Api/Plan/FetchOperator?TokenId=da9c3bba-770c-4034-af9e-20e4959b26f2&Number=${number}`);
      console.log("Response:", response.data);
  
      const operatorName = response.data.OperatorName;
      console.log("Operator Name from API:", operatorName);
      
      const operatorCode = getOperatorCodeByName(operatorName);
      console.log("Operator Code:", operatorCode);
      const operator = services.find(item => item.name.toLowerCase() === operatorName.toLowerCase());
      if (!operator) {
        Alert.alert("Operator not found for name:", operatorName);
        return;
      }
      // Ab tum yahan API ya state update kar sakte ho
      navigation.navigate('CompanyRecharge', { operator: operator, mode: mode, opcodenew: operatorCode, number: number });
      setPhoneNumber('');
    } catch (error) {
      console.log("Error:", error);
    }
  };
  

  const handleInputChange = (text) => {
    // Sirf digits allow karo
    const cleaned = text.replace(/[^0-9]/g, '');

    setPhoneNumber(cleaned);

    if (cleaned.length === 10) {
      onPhoneSubmit(cleaned);
    }
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <GradientLayout>
      <SafeAreaView style={{
        paddingVertical: verticalScale(16),
        paddingHorizontal: horizontalScale(16)
      }}>
        {/* <Modal
          visible={showErrorModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleErrorModalOk}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{
              backgroundColor: 'white',
              padding: moderateScale(24),
              borderRadius: moderateScale(16),
              width: '80%',
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: moderateScale(20),
                fontWeight: 'bold',
                marginBottom: verticalScale(16)
              }}>Alert</Text>
              <Text style={{
                color: '#333',
                textAlign: 'center',
                marginBottom: verticalScale(24)
              }}>{errorMessage}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#3b82f6',
                  paddingVertical: verticalScale(12),
                  paddingHorizontal: horizontalScale(48),
                  borderRadius: 9999
                }}
                onPress={handleErrorModalOk}
              >
                <Text style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: moderateScale(18)
                }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}
        <Header headingTitle="Mobile Recharge" />
        <View className="bg-white rounded-full flex-row items-center px-4 mb-4"
          style={{ height: 50 }}
        >
          <TextInput
            placeholder="Enter Mobile No"
            className="flex-1 py-2 text-gray-700 font-bold text-lg"
            placeholderTextColor="#888"
            value={phoneNumber}
            onChangeText={handleInputChange}
            maxLength={10}
            keyboardType="number-pad"
          />
          <Ionicons name="search" size={28} color="#666" />
        </View>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: verticalScale(120)
          }}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

export default MobileRechargeScreen;
