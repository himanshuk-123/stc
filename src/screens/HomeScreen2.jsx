import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator, Modal, Alert, Dimensions, RefreshControl, Platform, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import logo from '../../assets/logo.png';
import GradientLayout from '../component/GradientLayout';
import { useNavigation } from '@react-navigation/native';
import CarouselComponent from '../component/Carousel';
import { useIsFocused } from '@react-navigation/native';
import { saveUserData } from '../redux/slices/userSlice';
import { logout } from '../utils/authUtils';
import { horizontalScale, verticalScale } from '../utils/responsive';
import { dashboardHome } from '../component/Commonfunction';
import CircleView from '../component/CircleView';
import LinearGradient from 'react-native-linear-gradient';
import burger from '../../assets/burger-icon.jpg'
import notification from '../../assets/notification.png'  
import wallet from '../../assets/wallet.png'
import commission from '../../assets/commissionImg.png'
import add_upi from '../../assets/UPI_icon.png'
import add_money from '../../assets/add_money.png'
import reports_icon from '../../assets/reports_icon.png'
import day_book from '../../assets/userDayBook.webp'
import mobile_recharge_icon from '../../assets/mobile_recharge.png'
import dth_recharge_icon from '../../assets/dth_Recharge.webp'
import bill_payment_icon from '../../assets/services1.png'
import payment_status_icon from '../../assets/paymentStatus.jpg'
import today_report_icon from '../../assets/today_report.png'
import payment_request_icon from '../../assets/paymentRequest.png'
const chunkArray = (array, size) => {
  return array.reduce((acc, _, index) => {
    if (index % size === 0) acc.push(array.slice(index, index + size));
    return acc;
  }, []);
};

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
  const [amount, setAmount] = useState(0);

  const items = [
    { icon: today_report_icon, label: 'Today Report' ,onPress:()=>navigation.navigate('UserDayBook')},
    { icon: mobile_recharge_icon, label: 'Mobile Recharge' ,onPress:()=>navigation.navigate('MobileRecharge')},
    { icon: dth_recharge_icon, label: 'DTH Recharge' ,onPress:()=>navigation.navigate('DTHRecharge')},
    { icon: bill_payment_icon, label: 'Bill Payment' ,onPress:()=>navigation.navigate('Services')},
    { icon: payment_request_icon, label: 'Payment Request' ,onPress:()=>navigation.navigate('PaymentRequest')},
    { icon: payment_status_icon, label: 'Payment Status' ,onPress:()=>navigation.navigate('PaymentStatus')},
    { icon: reports_icon, label: 'Reports' ,onPress:()=>navigation.navigate('Reports') },
    { icon: day_book, label: 'Day Book' ,onPress:()=>navigation.navigate('UserDayBook')},
    { icon: add_upi, label: 'Add UPI' ,onPress:()=>navigation.navigate('AddUPI')},
    { icon: add_money, label: 'Add Money' ,onPress:()=>navigation.navigate('AddMoney')}
  ];
  const rows = chunkArray(items, 4);

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
                <Text style={{ color: 'red', fontSize: 30, fontWeight: 'bold' }}>
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
                <Image source={burger} style={{height:20,width:20}}/>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.walletContainer}>
                <Image source={wallet} style={{height:20,width:20}}/>
                <Text style={{ color: '#00e676', fontSize: 18, fontWeight: 'bold',paddingLeft:5 }}>₹ {userData.closingbalance ? parseFloat(userData.closingbalance) : '0.00'}</Text>
              </View>
              <View style={[styles.walletContainer]}>
                <Image source={wallet} style={{height:20,width:20}}/>
                <Text style={styles.balanceText}>₹ {userData.standingbalance ? parseInt(userData.standingbalance) : '0.00'}</Text>
              </View>
            </View>
            {/* <View style={[styles.walletContainer,{marginTop:verticalScale(10),marginBottom:verticalScale(10)}]}>
              <Entypo name='wallet' size={30} color="#181869" />
              <Text style={styles.balanceText}>₹ {userData.standingbalance}</Text>
            </View> */}
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Image source={notification} style={{height:30,width:30}}/>
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


      {/* First Gradient Section */}
      <LinearGradient
        colors={['#f6d365', '#fda085']} // Beautiful Golden to Peach
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 10,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          marginBottom: 15,
        }}
      >
        {/* Items */}
        {[
          { icon: commission, label: 'Commission', bgColor: '#e6f7ff', iconColor: '#ffffff',onPress:()=>navigation.navigate('Comission')},
          { icon: wallet, label: 'Credit Balance', bgColor: '#e6f7ff', iconColor: '#ffffff',onPress:()=>navigation.navigate('StandingReport') },
          { icon: add_upi, label: 'Add UPI', bgColor: '#e6f7ff', iconColor: '#181869',onPress:()=>Alert.alert('Add upi feature coming soon') },
          { icon: add_money, label: 'Wallet to Wallet', bgColor: '#e6f7ff', iconColor: '#181869',onPress:()=>navigation.navigate('WalletPayment') },
        ].map((item, index) => (
          <View key={index} style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <CircleView size={verticalScale(40)} backgroundColor={item.bgColor} onPress={item.onPress}>
              <View style={{ alignItems: 'center' }}>
                {/* <Feather name={item.icon} size={28} color={item.iconColor} /> */}
                <Image source={item.icon} style={{height:20,width:20}}/>
              </View>
            </CircleView>
            <Text
              style={{
                fontSize: 10,
                color: '#181869',
                marginTop: 4,
                textAlign: 'center',
                width: 60, // Slightly wider for better wrapping
                flexWrap: 'wrap',
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </LinearGradient>

      {/* Second Gradient Section */}
      <LinearGradient
        colors={['#89f7fe', '#66a6ff']} // Fresh Cyan to Deep Sky Blue
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 10,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          marginBottom: 10,
          marginTop: verticalScale(10),
        }}
      >
        {rows.map((row, rowIdx) => (
          <View
            key={rowIdx}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: rowIdx === rows.length - 1 ? 0 : 10,
            }}
          >
            {row.map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center' }}>
                <CircleView size={verticalScale(40)} backgroundColor="#e6f7ff" onPress={item.onPress}>
                  <View style={{ alignItems: 'center' }}>
                      <Image source={item.icon} style={{height:20,width:20}}/>
                  </View>
                </CircleView>
                <Text
                  style={{
                    fontSize: 10,
                    color: '#181869',
                    marginTop: 4,
                    textAlign: 'center',
                    width: 60, // Slightly wider for wrapping
                    flexWrap: 'wrap',
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
            {/* Fill empty spaces if less than 4 items in the row */}
            {Array.from({ length: 4 - row.length }).map((_, idx) => (
              <View key={`empty-${idx}`} style={{ flex: 1 }} />
            ))}
          </View>
        ))}
      </LinearGradient>

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
    color: '#ff5252'
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

