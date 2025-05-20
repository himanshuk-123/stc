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

const mode = '2'
const DTHRechargeScreen = () => {
  const [services, setServices] = useState([]);
  const {userData} = useContext(UserContext);
  const navigation = useNavigation();

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

        const response = await RechargeApiServices.operator(
          payload.Tokenid,
          payload.mode,
          payload.Version,
          payload.Location
        );

        const data = response.data;

        if (data.ERROR === '0') {
          const formattedData = data.Operator.map((item, index) => ({
            id: index.toString(),
            name: item.operatorname,
            image: IMAGE_BASE_URL + item.operator_img.replace(/^~\//, ''),
          }));

          setServices(formattedData);
        } else {
          console.log('API Error:', data.MESSAGE);
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
        onPress={() => navigation.navigate('CompanyRechargeScreen', { operator: item ,mode: mode} )}
      />
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView className="py-4 px-4">
        <Header headingTitle="DTH Recharge" />
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

export default DTHRechargeScreen;
