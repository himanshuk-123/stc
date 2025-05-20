import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Cards from '../component/cards';
import logo from '../../assets/logo.png';
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import add_money from '../../assets/add_money.png';
import mobile_recharge_icon from '../../assets/mobile_recharge.png';
import reports_icon from '../../assets/reports_icon.png';
import CustomButton from '../component/button';
import GradientLayout from '../component/GradientLayout';
import AddMoneyScreen from './AddMoneyScreen';
import RechargeScreen from './RechargeScreen';
import ReportsScreen from './ReportsScreen';
import { useNavigation } from '@react-navigation/native';
import CarouselComponent from '../component/Carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';
import ReportService from '../services/reportService';
import Constants from 'expo-constants';
import { Entypo } from '@expo/vector-icons'; // Arrow icon ke liye

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userData, clearUserData,saveUserData} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    closingBalance: '',
    standingBalance: '',
    notification: '',
  });
  const scrollX = useRef(new Animated.Value(0)).current;
  const [asyncStorageData, setAsyncStorageData] = useState({});

  useEffect(() => {
    if (!userData.tokenid) return;
  
    const dashboardHome = async () => {
      try {
        const payload = {
          Tokenid: userData.tokenid,
          FormDate: null,
          ToDate: null,
          Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
          Location: null,
        };
  
        const response = await ReportService.DashboardHome(
          payload.Tokenid,
          payload.FormDate,
          payload.ToDate,
          payload.Version,
          payload.Location
        );
  
        const { ClosingBalance, StandingBalance, Notification } = response.data;
  
        await saveUserData({
          ...userData,
          closingbalance: ClosingBalance,
          standingbalance: StandingBalance,
        });
  
        setDashboardData({
          closingBalance: ClosingBalance,
          standingBalance: StandingBalance,
          notification: Notification || '',
        });
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }finally {
        setIsLoading(false);
      } 
    };
  
    dashboardHome();
  }, [userData.tokenid]);
  

  useEffect(() => {
    if (dashboardData.notification) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -100,
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(scrollX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [dashboardData.notification]);

  useEffect(() => {
    const fetchAsyncStorageData = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      const storageObject = Object.fromEntries(result);
      setAsyncStorageData(storageObject);
    };
    fetchAsyncStorageData();
  }, [userData]);

  const logout = () => {
    clearUserData();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Ya koi spinner etc.
  }

  return (

    
    <GradientLayout>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
              <View style={{ backgroundColor: 'black', padding: 8, borderRadius: 999 }}>
                <Icon name="menu" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <View className="flex-row items-center">
              <Entypo name='wallet' size={30} color="#181869"/>
              <Text className="ml-3 text-lg font-bold">₹ {userData.closingbalance}</Text>
              </View>
            <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
              <Icon name="bell" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Balance Display */}
          {/* <View className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-semibold mb-2">Your Balance</Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-gray-600">Closing Balance</Text>
                <Text className="text-xl font-bold">₹ {userData.closingbalance}</Text>
              </View>
              <View>
                <Text className="text-gray-600">Standing Balance</Text>
                <Text className="text-xl font-bold">₹{userData.standingbalance}</Text>
              </View>
            </View>
          </View> */}

          {/* Carousel */}
          <View >
            <CarouselComponent />
          </View>

          {/* Notification Ticker */}
          {dashboardData.notification && (
            <View className="bg-yellow-100 p-2 rounded-lg mb-4 overflow-hidden">
              <Animated.Text
                style={{
                  transform: [{ translateX: scrollX }],
                  whiteSpace: 'nowrap',
                }}
                className="text-yellow-800 font-medium"
                
              >
                {dashboardData.notification}
              </Animated.Text>
            </View>
          )}

          {/* Row of 2 Cards */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Cards
              imageSource={add_money}
              title="Add Money"
              height={130}
              width={150}
              gradientColors={['#d48ced', '#913dad']}
              navigateTo={AddMoneyScreen}
              textColor='#fff'
              fontWeight='400'
              style={{fontSize:12}}
            />
            <Cards
              imageSource={mobile_recharge_icon}
              title="Recharges"
              height={130}
              width={150}
              gradientColors={['#f5d3a6', '#cf7a0a']}
              navigateTo={RechargeScreen}
              textColor='#fff'
              fontWeight='400'
              style={{fontSize:12}}
            />
          </View>

          {/* Row of 3 Smaller Cards */}
          <View className="flex-row justify-between">
            <Cards
              imageSource={live_chat}
              title="Chat with us"
              height={110}
              width={100}
              gradientColors={['#f2e29b', '#cfb546']}
              textColor='#fff'
              fontWeight='400'
              style={{fontSize:12}}
            />
            <Cards
              imageSource={talk_to_us}
              title="Talk to us"
              height={110}
              width={100}
              gradientColors={['#fca9c9', '#c94b7b']}
              textColor='#fff'
              fontWeight='400'
              style={{fontSize:12}}
            />
            <Cards
              imageSource={reports_icon}
              title="Reports"
              height={110}
              width={100}
              gradientColors={['#defcff', '#3cb5d6']}
              navigateTo={ReportsScreen}
              textColor='#fff'
              fontWeight='400'
              style={{fontSize:12}}
            />
          </View>

          {/* Logo */}
          <View style={{ alignItems: 'center', marginVertical: 24 }}>
            <Image source={logo} style={{ width: '60%', height: 80, resizeMode: 'contain' }} />
          </View>

          {/* 2 CustomButtons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
            <CustomButton height={50} width={'48%'} title="Cash Back" />
            <CustomButton height={50} width={'48%'} title="Check Balance" />
          </View>
          {/* <View><Text>
            {userData.tokenid}
            {userData.closingbalance}
            {userData.standingbalance}
            {userData.mobilenumber}
            {userData.email}
            {userData.shopname}
            {AsyncStorage.getItem('tokenid')}
            </Text>
          </View> */}
          {/* Debug Section: Show all userData and AsyncStorage data */}
          <View style={{ marginTop: 20, backgroundColor: '#eee', padding: 10, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Debug: Context userData</Text>
            <Text selectable style={{ fontSize: 12 }}>{JSON.stringify(userData, null, 2)}</Text>
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Debug: AsyncStorage Data</Text>
            <Text selectable style={{ fontSize: 12 }}>{JSON.stringify(asyncStorageData, null, 2)}</Text>
          </View>
          <View>
            <CustomButton title="Register" onPress={() => navigation.navigate('RegisterScreen')} />
          </View>
          <Text>Himanshu</Text>
        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default HomeScreen;
