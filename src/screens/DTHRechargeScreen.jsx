import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, FlatList, ActivityIndicator, Text, Modal, TouchableOpacity } from 'react-native';
import Header from '../component/Header';
import SearchBar from '../component/SearchBar';
import Cards from '../component/cards';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RechargeApiServices from '../services/RechargeService';
import Constants from 'expo-constants';
import GradientLayout from '../component/GradientLayout';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../utils/authUtils';
const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';

const mode = '2'
const DTHRechargeScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const cardWidth = "90%";
  const cardHeight = verticalScale(80);
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        setLoading(true);
        const token = userData.tokenid;
        const payload = {
          Tokenid: token,
          mode: mode,
          Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
          Location: null,
        };

        const response = await RechargeApiServices.operator(
          payload.Tokenid,
          payload.mode,
          payload.Version,
          payload.Location
        );

        const data = response.data;
        console.log("himanshu data: ",data);
        if(data.STATUSCODE !== '1'){
          setShowErrorModal(true);
          setErrorMessage(data.MESSAGE);
        }
        if (data.ERROR === '0') {
          const formattedData = data.Operator.map((item, index) => ({
            id: index.toString(),
            name: item.operatorname,
            image: IMAGE_BASE_URL + item.operator_img.replace(/^~\//, ''),
            opcodenew: item.opcodenew,
          }));

          setServices(formattedData);
        } else {
          console.log('API Error:', data.MESSAGE);
        }
      } catch (error) {
        console.log('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  const renderItem = ({ item }) => {
    if (!item || !item.image || !item.name) {
      return null; // Don't render if item or required properties are missing
    }
    
    return (
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
          imgheight={50}
          imgwidth={50}
          gradientColors={['#ffffff', '#ffffff']}
          style={{ fontSize: moderateScale(12) }}
          onPress={() => navigation.navigate('CompanyRecharge', { operator: item, mode:mode, opcodenew:item.opcodenew })}
          cardsPerRow={3}
        />
      </View>
    );
  };

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };
  return (
    <GradientLayout>
      <SafeAreaView style={{
        paddingVertical: verticalScale(16),
        paddingHorizontal: horizontalScale(16)
      }}>
      <Modal
          visible={showErrorModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleErrorModalOk}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-xl w-4/5 items-center">
              <Text className="text-xl font-bold mb-4">Alert</Text>
              <Text className="text-gray-800 text-center mb-6">{errorMessage}</Text>
              <TouchableOpacity
                className="bg-blue-500 py-3 px-12 rounded-full"
                onPress={handleErrorModalOk}
              >
                <Text className="text-white font-bold text-lg">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Header headingTitle="DTH Recharge" />
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : services.length > 0 ? (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: verticalScale(100)
            }}
          />
        ) : (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-lg text-gray-600">No DTH services available</Text>
          </View>
        )}
      </SafeAreaView>
    </GradientLayout>
  );
};

export default DTHRechargeScreen;
