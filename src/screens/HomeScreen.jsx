import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator, Modal, Alert, Dimensions, RefreshControl, Platform, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {Feather} from '@expo/vector-icons';
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
import { useIsFocused } from '@react-navigation/native';
import {Entypo} from '@expo/vector-icons';
import { saveUserData } from '../redux/slices/userSlice';
import { logout } from '../utils/authUtils';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { dashboardHome, handleCallPress } from '../component/Commonfunction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  // Use custom Redux hooks
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [amount,setAmount] = useState(0);

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
        version: '1',
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

  useEffect(() => {
    const loadKeys = async () => {
      console.log("keys", await AsyncStorage.getAllKeys());
    }
    loadKeys();
  }, []);

  const balanceCheck = () => {
    setShowBalanceModal(true);
  };

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };

  // useEffect(() => {
  //   if (dashboardData.notification) {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(scrollX, {
  //           toValue: -100,
  //           duration: 10000,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(scrollX, {
  //           toValue: 0,
  //           duration: 0,
  //           useNativeDriver: true,
  //         }),
  //       ])
  //     ).start();
  //   }
  // }, [dashboardData.notification]);

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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        {/* Error Modal */}
        <Modal
          visible={showErrorModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleErrorModalOk}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alert</Text>
              <Text style={styles.modalText}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleErrorModalOk}
              >
                <Text style={styles.modalButtonText}>OK</Text>
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
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowBalanceModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.balanceModalContent}>
                <Image
                  source={logo}
                  style={styles.modalLogo}
                  resizeMode="contain"
                />

                <Text style={styles.balanceTitle}>Your Current Balance</Text>
                <Text style={styles.balanceAmount}>
                  ₹ {userData.closingbalance ? parseFloat(userData.closingbalance) : '0.00'}
                </Text>
                <Text style={styles.balanceTitle}>Your Outstanding Balance</Text>
                <Text style={{color:'red',fontSize:30,fontWeight:'bold'}}>
                  ₹ {userData.standingbalance ? parseInt(userData.standingbalance) : '0.00'}
                </Text>

                <TouchableOpacity
                  style={styles.balanceModalButton}
                  onPress={() => setShowBalanceModal(false)}
                >
                  <Text style={styles.balanceModalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchDashboard} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.menuButton}>
                <Feather name="menu" size={20} color="white" />
              </View>
            </TouchableOpacity>

            <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
            <View style={styles.walletContainer}>
              <Entypo name='wallet' size={30} color="#181869" />
              <Text style={{color:'green',fontSize:18,fontWeight:'bold'}}>₹ {userData.closingbalance ? parseFloat(userData.closingbalance) : '0.00'}</Text>
            </View>
            <View style={[styles.walletContainer]}>
              <Entypo name='wallet' size={30} color="#181869" />
              <Text style={styles.balanceText}>₹ {userData.standingbalance ? parseInt(userData.standingbalance) : '0.00'}</Text>
            </View>
            </View>
            {/* <View style={[styles.walletContainer,{marginTop:verticalScale(10),marginBottom:verticalScale(10)}]}>
              <Entypo name='wallet' size={30} color="#181869" />
              <Text style={styles.balanceText}>₹ {userData.standingbalance}</Text>
            </View> */}
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Feather name="bell" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Carousel */}
          <View style={styles.carouselContainer}>
            <CarouselComponent />
          </View>
          {/* Notification Ticker */}
          {dashboardData.notification && (
            <View style={styles.notificationContainer}>
              <Animated.Text
                style={[
                  styles.notificationText,
                  {
                    transform: [{ translateX: scrollX }],
                  }
                ]}
              >
                {dashboardData.notification}
              </Animated.Text>
            </View>
          )}

          {/* Row of 2 Cards */}
          <View style={styles.twoCardsRow}>
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
          <View style={styles.threeCardsRow}>
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
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(14) }}
              cardsPerRow={3}
              onPress={handleCallPress}
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
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={styles.logo}
            />
          </View>

          {/* 2 CustomButtons */}
          <View style={styles.buttonContainer}>
            <CustomButton width={'48%'} title="Cash Back" onPress={() => Alert.alert('Cashback', 'Cashback feature coming soon')} />
            <CustomButton width={'48%'} title="Check Balance" onPress={balanceCheck} />
          </View>
          {
            userData.usertype === 'Distributer' && <CustomButton title="Wallet Topup" onPress={() => navigation.navigate('WalletTopup',{userId: ''})} />
          }
        </ScrollView>
        {/* <CustomButton title='register' onPress={()=>navigation.navigate('Register')}></CustomButton> */}
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  modalText: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 24
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 9999
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceModalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center'
  },
  modalLogo: {
    width: verticalScale(100),
    height: verticalScale(100),
    marginBottom: verticalScale(16)
  },
  balanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(10)
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: 'green'
  },
  balanceModalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 9999,
    marginTop: 16
  },
  balanceModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10)
  },
  menuButton: {
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 9999
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red'
  },
  carouselContainer: {
    marginBottom: verticalScale(10)
  },
  notificationContainer: {
    backgroundColor: '#fef9c3',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },
  notificationText: {
    color: '#854d0e',
    fontWeight: '500'
  },
  twoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: verticalScale(140),
    marginBottom: verticalScale(15)
  },
  threeCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: verticalScale(110),
    marginBottom: verticalScale(15)
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(10)
  },
  logo: {
    width: horizontalScale(75),
    height: verticalScale(30),
    resizeMode: 'contain'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(24)
  }
});

export default HomeScreen;