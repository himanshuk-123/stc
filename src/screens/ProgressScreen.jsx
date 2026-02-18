import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  Platform, 
  Alert, 
  Linking, 
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import BankService from '../services/BankService';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width > 414;

const ProgressScreen = ({ route }) => {
  const navigation = useNavigation();
  const { Time } = route.params;
  const userData = useSelector(state => state.user);

  const [timeLeft, setTimeLeft] = useState(120);
  const [status, setStatus] = useState('PENDING');
  const [message, setMessage] = useState('');
  const [apiTime, setApiTime] = useState(Time);
  const [showCustomerCare, setShowCustomerCare] = useState(false);
  
  // Animation values
  const pulseAnim = new Animated.Value(1);
  const progressAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const fadeAnim = new Animated.Value(0);
  
  const CUSTOMER_CARE = '9119870214';

  // Pulsing animation for pending state
  useEffect(() => {
    if (status === 'PENDING' && timeLeft > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [status, timeLeft]);

  // Progress bar animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (120 - timeLeft) / 120,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  // Slide in animation for customer care section
  useEffect(() => {
    if (showCustomerCare) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showCustomerCare]);

  // Countdown timer (2 min)
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          if (apiTime === 5) {
            setStatus('QUEUED');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [apiTime]);

  // Effect to update status when both timeLeft is 0 and apiTime is 5
  useEffect(() => {
    if (timeLeft === 0 && apiTime === 5) {
      setStatus('QUEUED');
      setShowCustomerCare(true);
    }
  }, [timeLeft, apiTime]);

  // API call every 20 seconds
  useEffect(() => {
    if (apiTime <= 0) {
      Alert.alert('Error', 'Invalid time value');
      navigation.navigate('MainTabs');
      return;
    }

    const interval = setInterval(async () => {
      try {
        const payload = {
          Tokenid: userData.tokenid,
          WalletID: apiTime,
          Version: Platform.Version.toString(),
        }
        console.log(payload);
        const response = await BankService.WalletRequestStatusCheck(
          payload.Tokenid,
          payload.WalletID,
          payload.Version
        );

        console.log('WalletRequestStatusCheck:', response.data);

        if (response?.data?.Error === '0') {
          const time = response?.data?.Time;
          setMessage(response?.data?.Message || '');
          console.log(time)
          if (time === '6') {
            Alert.alert('Success', response.data.Message || 'Wallet Approved');
            navigation.navigate('MainTabs');
            clearInterval(interval);
          } else if (time === '7') {
            Alert.alert('Cancelled', response.data.Message || 'Wallet Cancelled');
            navigation.goBack();
            clearInterval(interval);
          } else if (time === '5') {
            setApiTime(5);
            if (timeLeft === 0) {
              setStatus('QUEUED');
            }
          } else {
            Alert.alert('Info', response.Message || 'Unknown response');
            navigation.navigate('MainTabs');
            clearInterval(interval);
          }
        } else {
          Alert.alert('Error', response?.Message || 'Something went wrong');
          navigation.navigate('MainTabs');
          clearInterval(interval);
        }
      } catch (error) {
        console.log('API Error:', error);
      }
    }, 20000);

    const stopTimer = setTimeout(() => {
      clearInterval(interval);
      if (apiTime === 5) {
        setStatus('QUEUED');
      }
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(stopTimer);
    };
  }, []);

  const callCustomerCare = () => {
    console.log('Calling customer care:', CUSTOMER_CARE);
    Linking.openURL(`tel:${CUSTOMER_CARE}`)
      .catch(error => {
        console.error('Error opening dialer:', error);
        Alert.alert('Error', 'Could not open phone dialer. Please call customer care manually at ' + CUSTOMER_CARE);
      });
  };

  // Calculate progress bar width
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <GradientLayout>
      <SafeAreaView style={styles.safeArea}>
        <Header headingTitle={'Payment Request'} />
        <View style={styles.container}>
          
          {/* Main Content Card */}
          <View style={styles.card}>
            
            {status === 'PENDING' && timeLeft > 0 ? (
              <>
                {/* Animated Loading Circle */}
                <View style={styles.loadingContainer}>
                  <Animated.View 
                    style={[
                      styles.circle,
                      { transform: [{ scale: pulseAnim }] }
                    ]}
                  >
                    <LinearGradient
                      colors={['#8092c9ff', '#a0b2e9ff']}
                      style={styles.gradientCircle}
                    >
                      <ActivityIndicator size="large" color="#fff" />
                    </LinearGradient>
                  </Animated.View>
                  
                  <Text style={styles.waitText}>Processing your payment request...</Text>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <Animated.View 
                        style={[
                          styles.progressBarFill,
                          { width: progressWidth }
                        ]}
                      />
                    </View>
                    <Text style={styles.timerText}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </Text>
                  </View>
                  
                  {message ? (
                    <View style={styles.messageBubble}>
                      <Text style={styles.apiMessage}>{message}</Text>
                    </View>
                  ) : null}
                </View>
              </>
            ) : (status === 'QUEUED' || showCustomerCare) ? (
              <Animated.View 
                style={[
                  styles.customerCareContainer,
                  {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim
                  }
                ]}
              >
                {/* Queue Status Icon */}
                <View style={styles.queueIcon}>
                  <Text style={styles.queueIconText}>⏳</Text>
                </View>
                
                <Text style={styles.queueTitle}>Still Processing</Text>
                <Text style={styles.queueDescription}>
                  Your request is taking longer than expected and is currently in queue.
                </Text>
                
                <View style={styles.contactCard}>
                  <Text style={styles.contactTitle}>Need immediate assistance?</Text>
                  <Text style={styles.contactSubtitle}>Contact our customer care team:</Text>
                  
                  <TouchableOpacity 
                    onPress={callCustomerCare}
                    style={styles.callButton}
                  >
                    <LinearGradient
                      colors={['#8092c9ff', '#6a7cb5ff']}
                      style={styles.callButtonGradient}
                    >
                      <Text style={styles.phoneIcon}>📞</Text>
                      <Text style={styles.phoneText}>{CUSTOMER_CARE}</Text>
                      <Text style={styles.callNowText}>Call Now</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : null}
          </View>
          
          {/* Background decorative elements */}
          <View style={styles.floatingCircle1} />
          <View style={styles.floatingCircle2} />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.04), // Responsive padding
    paddingVertical: Math.max(10, height * 0.02),
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Math.max(20, width * 0.06), // Responsive border radius
    padding: Math.max(20, width * 0.05), // Responsive padding
    width: '100%',
    maxWidth: 400,
    minWidth: Math.min(300, width * 0.85), // Minimum width for very small devices
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: height * 0.02, // Responsive margin
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Math.max(10, height * 0.02),
  },
  circle: {
    width: Math.max(80, width * 0.2), // Responsive circle size
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    marginBottom: Math.max(20, height * 0.03),
    shadowColor: '#8092c9ff',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientCircle: {
    width: '100%',
    height: '100%',
    borderRadius: Math.max(40, width * 0.1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitText: {
    fontSize: Math.max(16, width * 0.045), // Responsive font size
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: Math.max(20, height * 0.03),
    lineHeight: Math.max(22, width * 0.06),
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Math.max(15, height * 0.02),
  },
  progressBarBackground: {
    width: '100%',
    height: Math.max(6, width * 0.015), // Responsive height
    backgroundColor: '#e3e9f7ff',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Math.max(10, height * 0.015),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8092c9ff',
    borderRadius: 4,
  },
  timerText: {
    fontSize: Math.max(16, width * 0.045),
    fontWeight: '700',
    color: '#8092c9ff',
  },
  messageBubble: {
    backgroundColor: 'rgba(128, 146, 201, 0.1)',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(8, height * 0.01),
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8092c9ff',
    marginTop: Math.max(8, height * 0.01),
    width: '100%',
  },
  apiMessage: {
    color: '#2c3e50',
    fontSize: Math.max(12, width * 0.035),
    textAlign: 'center',
    lineHeight: Math.max(18, width * 0.05),
  },
  customerCareContainer: {
    alignItems: 'center',
    paddingVertical: Math.max(5, height * 0.01),
  },
  queueIcon: {
    width: Math.max(60, width * 0.15),
    height: Math.max(60, width * 0.15),
    borderRadius: Math.max(30, width * 0.075),
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.max(15, height * 0.02),
  },
  queueIconText: {
    fontSize: Math.max(30, width * 0.08),
  },
  queueTitle: {
    fontSize: Math.max(18, width * 0.05),
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: Math.max(8, height * 0.01),
    textAlign: 'center',
  },
  queueDescription: {
    fontSize: Math.max(14, width * 0.038),
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: Math.max(20, width * 0.055),
    marginBottom: Math.max(20, height * 0.03),
  },
  contactCard: {
    backgroundColor: 'rgba(227, 233, 247, 0.5)',
    borderRadius: Math.max(16, width * 0.04),
    padding: Math.max(16, width * 0.04),
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128, 146, 201, 0.2)',
  },
  contactTitle: {
    fontSize: Math.max(16, width * 0.045),
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: Math.max(6, height * 0.008),
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: Math.max(12, width * 0.035),
    color: '#7f8c8d',
    marginBottom: Math.max(15, height * 0.02),
    textAlign: 'center',
  },
  callButton: {
    width: '100%',
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    shadowColor: '#8092c9ff',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  callButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, height * 0.015),
  },
  phoneIcon: {
    fontSize: Math.max(20, width * 0.055),
  },
  phoneText: {
    fontSize: Math.max(16, width * 0.045),
    color: '#fff',
    fontWeight: '700',
  },
  callNowText: {
    fontSize: Math.max(12, width * 0.033),
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
  },
  floatingCircle1: {
    position: 'absolute',
    width: Math.max(150, width * 0.4),
    height: Math.max(150, width * 0.4),
    borderRadius: Math.max(75, width * 0.2),
    backgroundColor: 'rgba(128, 146, 201, 0.1)',
    top: '10%',
    left: -Math.max(30, width * 0.1),
    zIndex: -1,
  },
  floatingCircle2: {
    position: 'absolute',
    width: Math.max(100, width * 0.3),
    height: Math.max(100, width * 0.3),
    borderRadius: Math.max(50, width * 0.15),
    backgroundColor: 'rgba(227, 233, 247, 0.3)',
    bottom: '15%',
    right: -Math.max(20, width * 0.08),
    zIndex: -1,
  },
});

export default ProgressScreen;