import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator, Modal, Alert, Dimensions,RefreshControl } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
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
import { useNavigation } from '@react-navigation/native';
import CarouselComponent from '../component/Carousel';
import ReportService from '../services/reportService';
import Constants from 'expo-constants';
import { Entypo } from '@expo/vector-icons';
import { saveUserData } from '../redux/slices/userSlice';
import { logout } from '../utils/authUtils';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { dashboardHome } from '../component/Commonfunction';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();

  // Use custom Redux hooks
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    closingBalance: '',
    standingBalance: '',
    notification: '',
  });
  const scrollX = useRef(new Animated.Value(0)).current;

  const fetchDashboard = async () => {
    setIsLoading(true);
    setRefreshing(true);
    const result = await dashboardHome({ userData });

    if (result.success) {
      const { closingBalance, standingBalance, notification } = result.data;

      dispatch(saveUserData({
        closingbalance: closingBalance,
        standingbalance: standingBalance,
        version: Constants?.expoConfig?.version?.split('.')[0] || '1',
        location: userData.location,
      }));

      setDashboardData({
        closingBalance,
        standingBalance,
        notification,
      });
    } else {
      setErrorMessage(result.errorMessage);
      setShowErrorModal(true);
    }
    setIsLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {  
    fetchDashboard();
  }, []);

  const balanceCheck = () => {
    setShowBalanceModal(true);
  };

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };

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

  // Updated to use the global logout function
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => logout()
        }
      ]
    );
  };

  // Handle card navigation
  // const handleCardNavigation = (screenName) => {
  //   navigation.navigate(screenName);
  // };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" className='flex-1 justify-center items-center' />;
  }

  return (
    <GradientLayout>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Error Modal */}
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

        {/* Balance Modal */}
        <Modal
          visible={showBalanceModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowBalanceModal(false)}
          statusBarTranslucent={true}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            activeOpacity={1}
            onPress={() => setShowBalanceModal(false)}
          >
            <View className="flex-1 justify-center items-center">
              <View className="bg-white p-6 rounded-xl w-4/5 items-center">
                <Image
                  source={logo}
                  style={{ width: verticalScale(100), height: verticalScale(100), marginBottom: verticalScale(16) }}
                  resizeMode="contain"
                />

                <Text className="text-xl font-bold text-center mb-4">Your Current Balance</Text>
                <Text className="text-3xl font-bold text-center mb-6 text-blue-600">
                  ₹ {userData.closingbalance ? userData.closingbalance : '0.00'}
                </Text>

                <TouchableOpacity
                  className="bg-blue-500 py-3 px-12 rounded-full mt-4"
                  onPress={() => setShowBalanceModal(false)}
                >
                  <Text className="text-white font-bold text-lg">OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDashboard} />}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(10) }}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={{ backgroundColor: 'black', padding: 8, borderRadius: 999 }}>
                <Icon name="menu" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <View className="flex-row items-center">
              <Entypo name='wallet' size={30} color="#181869" />
              <Text className="ml-3 text-lg font-bold ">₹ {userData.closingbalance}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Icon name="bell" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Carousel */}
          <View style={{ marginBottom: verticalScale(10) }}>
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
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: verticalScale(140),
            marginBottom: verticalScale(15)
          }}>
            <Cards
              imageSource={add_money}
              title="Add Money"
              width="48%"
              height="90%"
              imgheight={verticalScale(70)}
              imgwidth={horizontalScale(70)}
              gradientColors={['#d48ced', '#913dad']}
              onPress={() => navigation.navigate('AddMoney')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(14) }}
              cardsPerRow={2}
            />
            <Cards
              imageSource={mobile_recharge_icon}
              title="Recharges"
              width="48%"
              height="90%"
              imgheight={verticalScale(70)}
              imgwidth={horizontalScale(70)}
              gradientColors={['#f5d3a6', '#cf7a0a']}
              onPress={() => navigation.navigate('Recharge')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(14) }}
              cardsPerRow={2}
            />
          </View>

          {/* Row of 3 Smaller Cards */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: verticalScale(110),
            marginBottom: verticalScale(15)
          }}>
            <Cards
              imageSource={live_chat}
              title="Chat with us"
              width="31%"
              height="100%"
              imgheight={verticalScale(50)}
              imgwidth={horizontalScale(50)}
              gradientColors={['#f2e29b', '#cfb546']}
              onPress={() => Alert.alert('Chat', 'Chat feature coming soon')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(14) }}
              cardsPerRow={3}
            />
            <Cards
              imageSource={talk_to_us}
              title="Talk to us"
              width="31%"
              height="100%"
              imgheight={verticalScale(50)}
              imgwidth={horizontalScale(50)}
              gradientColors={['#fca9c9', '#c94b7b']}
              onPress={() => Alert.alert('Support', 'Support feature coming soon')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(14) }}
              cardsPerRow={3}
            />
            <Cards
              imageSource={reports_icon}
              title="Reports"
              width="31%"
              height="100%"
              imgheight={verticalScale(50)}
              imgwidth={horizontalScale(50)}
              gradientColors={['#defcff', '#3cb5d6']}
              onPress={() => navigation.navigate('Reports')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(14) }}
              cardsPerRow={3}
            />
          </View>

          {/* Logo */}
          <View style={{ alignItems: 'center', marginVertical: verticalScale(10) }}>
            <Image
              source={logo}
              style={{
                width: horizontalScale(75),
                height: verticalScale(30),
                resizeMode: 'contain'
              }}
            />
          </View>

          {/* 2 CustomButtons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(24) }}>
            <CustomButton width={'48%'} title="Cash Back" onPress={() => Alert.alert('Cashback', 'Cashback feature coming soon')} />
            <CustomButton width={'48%'} title="Check Balance" onPress={balanceCheck} />
          </View>
          <CustomButton  title="Wallet Topup" onPress={() => navigation.navigate('WalletTopup',{userId: ''})} />
        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default HomeScreen;