import React, { useContext, useEffect, useState } from 'react';
import { View, SafeAreaView, FlatList } from 'react-native';
import Header from '../component/Header';
import SearchBar from '../component/SearchBar';
import Cards from '../component/cards';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RechargeApiServices from '../services/RechargeService';
import Constants from 'expo-constants';
import GradientLayout from '../component/GradientLayout';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';
const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';

const MobileRechargeScreen = () => {
  const [services, setServices] = useState([]);
  const{userData} = useContext(UserContext);
  const navigation = useNavigation();

  const mode = '1'
  useEffect(() => {
    const fetchOperators = async () => {
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
      }
    };

    fetchOperators();
  }, []);

  const renderItem = ({ item }) => (
    <View className="w-1/3 items-center my-2">
      <Cards
        imageSource={{ uri: item.image }}
        title={item.name}
        height={100}
        width={100}
        gradientColors={['#ffffff', '#ffffff']}
        style={{ fontSize: 12 }}
        onPress={() => navigation.navigate('CompanyRechargeScreen', { operator: item,mode:mode,opcodenew:item.opcodenew })}
      />
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView className="py-4 px-4">
        <Header headingTitle="Mobile Recharge" />
        <SearchBar placeholder="Enter Mobile No" />
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

export default MobileRechargeScreen;
