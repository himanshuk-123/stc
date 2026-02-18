import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator, Modal, Alert, Dimensions, RefreshControl, Platform, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
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
import { saveUserData } from '../redux/slices/userSlice';
import { logout } from '../utils/authUtils';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { dashboardHome, handleCallPress } from '../component/Commonfunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import burger from '../../assets/burger-icon.jpg';
import notification from '../../assets/notification.png'  
import wallet from '../../assets/wallet.png'
import userService from '../services/UserService'
import UserService from '../services/UserService';
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

  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  
  const balanceCheck = async() => {
    setIsBalanceLoading(true);
    const payload = {
      Tokenid: userData.tokenid,
      Version: Platform.OS === "android" ? Platform.Version.toString() : "1",
      Location: userData.location
    };  
    try{
      console.log(payload);
      const response = await UserService.BalanceCheck(
        payload.Tokenid,
        payload.Version,
        payload.Location
      );
      console.log("Balance Check Response: ", response.data);
      
      if (response.data && response.data.WBalance !== undefined) {
        // Update Redux state with fresh data
        dispatch(saveUserData({
          closingbalance: response.data.WBalance,
          standingbalance: response.data.OutStandingBalance
        }));

        // Update local state with fresh data
        setDashboardData({
          closingBalance: response.data.WBalance,
          standingBalance: response.data.OutStandingBalance,
          notification: dashboardData.notification // preserve notification
        });
        
        // Only show modal after data is refreshed
        setShowBalanceModal(true);
      } else {
        Alert.alert('Error', 'Unable to fetch balance data');
      }
    } catch(error) {
      console.log(error);
      Alert.alert('Error', 'Failed to check balance');
    } finally {
      setIsBalanceLoading(false);
    }
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
                  ₹ {userData.closingbalance ? parseFloat(userData.closingbalance).toFixed(2) : '0.00'}
                </Text>
                <Text style={styles.balanceTitle}>Your Outstanding Balance</Text>
                <Text style={{color:'red',fontSize:30,fontWeight:'bold'}}>
                  ₹ {userData.standingbalance ? parseFloat(userData.standingbalance).toFixed(2) : '0.00'}
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
        
        {/* Balance Loading Indicator */}
        <Modal
          visible={isBalanceLoading}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.balanceModalContent, styles.loadingContent]}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Fetching latest balance...</Text>
            </View>
          </View>
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
                <Image source={burger} style={{ width: 20, height: 20 }} />
              </View>
            </TouchableOpacity>

            <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
            <View style={styles.walletContainer}>
              <Image source={wallet} style={{ width: 20, height: 20 }} />
              <Text style={{color:'#00e676',fontSize:18,fontWeight:'bold',paddingLeft:5}}>₹ {userData.closingbalance ? parseFloat(userData.closingbalance) : '0.00'}</Text>
            </View>
            <View style={[styles.walletContainer]}>
              <Image source={wallet} style={{ width: 20, height: 20 }} />
              <Text style={{color:'#ff5252',fontSize:18,fontWeight:'bold',paddingLeft:5}}>₹ {userData.standingbalance ? parseInt(userData.standingbalance) : '0.00'}</Text>
            </View>
            </View>
            {/* <View style={[styles.walletContainer,{marginTop:verticalScale(10),marginBottom:verticalScale(10)}]}>
              <Entypo name='wallet' size={30} color="#181869" />
              <Text style={styles.balanceText}>₹ {userData.standingbalance}</Text>
            </View> */}
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Image source={notification} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
          </View>

          {/* Carousel */}
          <View style={styles.carouselContainer}>
            <CarouselComponent />
          </View>
          {/* Notification Ticker */}
          {dashboardData.notification && (
  <View style={styles.notificationWrapper}>
    <View style={styles.notificationContainer}>
      <Text style={styles.notificationText}>
        🔔 {dashboardData.notification}
      </Text>
    </View>
  </View>
)}
  


          {/* Row of 2 Cards */}
          <View style={styles.twoCardsRow}>
            <Cards
              imageSource={add_money}
              title="Add Money"
              width="48%"
              height="100%"
              imgheight={verticalScale(50)}
              imgwidth={horizontalScale(70)}
              gradientColors={['#d48ced', '#913dad']}
              onPress={() => navigation.navigate('AddMoney')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(13) }}
              cardsPerRow={2}
            />
            <Cards
              imageSource={mobile_recharge_icon}
              title="Recharges"
              width="48%"
              height="100%"
              imgheight={verticalScale(50)}
              imgwidth={horizontalScale(70)}
              gradientColors={['#f5d3a6', '#cf7a0a']}
              onPress={() => navigation.navigate('Recharge')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(13) }}
              cardsPerRow={2}
            />
          </View>

          {/* Row of 3 Smaller Cards */}
          <View style={styles.threeCardsRow}>
            <Cards
              imageSource={live_chat}
              title="Chat with us"
              width="31%"
              height="80%"
              imgheight={verticalScale(40)}
              imgwidth={horizontalScale(50)}
              gradientColors={['#f2e29b', '#cfb546']}
              onPress={() => Alert.alert('Chat', 'Chat feature coming soon')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(12) }}
              cardsPerRow={3}
            />
            <Cards
              imageSource={talk_to_us}
              title="Talk to us"
              width="31%"
              height="80%"
              imgheight={verticalScale(40)}
              imgwidth={horizontalScale(50)}
              gradientColors={['#fca9c9', '#c94b7b']}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(12) }}
              cardsPerRow={3}
              onPress={handleCallPress}
            />
            <Cards
              imageSource={reports_icon}
              title="Reports"
              width="31%"
              height="80%"
              imgheight={verticalScale(40)}
              imgwidth={horizontalScale(50)}
              gradientColors={['#defcff', '#3cb5d6']}
              onPress={() => navigation.navigate('Reports')}
              textColor='#fff'
              fontWeight='400'
              style={{ fontSize: moderateScale(12) }}
              cardsPerRow={3}
            />
          </View>

          {/* Logo */}
          {/* <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={styles.logo}
            />
          </View> */}

          {/* 2 CustomButtons */}
          <View style={styles.buttonContainer}>
            <CustomButton width={'48%'} title="Cash Back" onPress={() => Alert.alert('Cashback', 'Cashback feature coming soon')} />
            <CustomButton 
              width={'48%'} 
              title={isBalanceLoading ? "Loading..." : "Check Balance"} 
              onPress={balanceCheck} 
              disabled={isBalanceLoading} 
            />
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
    marginBottom: verticalScale(10),
    color:'black'
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#063d12ff'
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
  notificationWrapper: {
    height: 40, // Fixed height to avoid layout shift
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#fef9c3',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  
  notificationText: {
    color: '#854d0e',
    fontWeight: '500',
  },  
  twoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: verticalScale(100),
    marginBottom: verticalScale(15),
    marginTop: verticalScale(10)
  },
  threeCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: verticalScale(110),
    // marginBottom: verticalScale(15)
  },
  logoContainer: {
    alignItems: 'center',
        // marginVertical: verticalScale(10)
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
  },
  loadingContent: {
    padding: 30,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  }
});

export default HomeScreen;
