import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import { horizontalScale, moderateScale, verticalScale } from '../utils/responsive';
import { useAppSelector } from '../redux/hooks';
import axios from 'axios';
import BankService from '../services/BankService';
import Toast from 'react-native-toast-message';

const BASE_URL = 'https://onlinerechargeservice.in/App/webservice';
const IMAGE_BASE_URL = 'https://onlinerechargeservice.in';
const UPI_CALLBACK_URL = 'stc://upi-callback';

const PayUScreen = () => {
  const [amount, setAmount] = useState<string>('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankListLoading, setBankListLoading] = useState(true);
  const pendingUpiRef = useRef(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const userData = useAppSelector((state) => state.user);

  // Fetch bank list on screen focus
  useEffect(() => {
    if (isFocused) {
      fetchBankList();
    }
  }, [isFocused]);

  const handleUpiCallback = (url: string, force = false) => {
    if (!url || !url.startsWith(UPI_CALLBACK_URL)) {
      return;
    }

    if (!pendingUpiRef.current && !force) {
      return;
    }

    pendingUpiRef.current = false;

    const queryString = url.split('?')[1] || '';
    const params = new URLSearchParams(queryString);
    const rawStatus = params.get('Status') || params.get('status') || params.get('STATUS') || '';
    const status = rawStatus.toLowerCase();
    const txnRef =
      params.get('txnRef') ||
      params.get('TxnRef') ||
      params.get('approvalRefNo') ||
      params.get('ApprovalRefNo') ||
      params.get('txnId') ||
      params.get('tr') ||
      '';

    if (status === 'success') {
      Toast.show({
        type: 'success',
        text1: 'Payment Successful',
        text2: txnRef ? `Ref: ${txnRef}` : 'Your UPI payment was successful.',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    if (status === 'failure' || status === 'failed') {
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: txnRef ? `Ref: ${txnRef}` : 'Your UPI payment failed.',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    if (status === 'pending' || status === 'submitted') {
      Toast.show({
        type: 'info',
        text1: 'Payment Pending',
        text2: txnRef ? `Ref: ${txnRef}` : 'Your UPI payment is pending.',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Payment Status',
      text2: 'Unable to confirm payment status. Please check later.',
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      handleUpiCallback(event.url);
    });

    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        handleUpiCallback(initialUrl, true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const fetchBankList = async () => {
    setBankListLoading(true);
    try {
      const response = await BankService.BankList(
        userData.tokenid,
        Platform.OS === 'android' ? Platform.Version.toString() : '1',
        userData.location || null
      );

      console.log('Bank List Response:', response.data);

      if (response.data.STATUSCODE === '1' && response.data.MESSAGE === 'SUCCESS') {
        // Filter only active UPI banks (IsUpiActive === 1)
        const activeUpibanks = response.data.BANKLIST.filter(
          (bank) => bank.IsUpiActive === 1
        );
        setBankList(activeUpibanks);

        // Select first bank by default
        if (activeUpibanks.length > 0) {
          setSelectedBank(activeUpibanks[0]);
        }
      } else {
        Alert.alert('Error', 'Failed to load bank list');
      }
    } catch (error) {
      console.error('Bank List Error:', error);
      // Network error toast already shown by API interceptor
    } finally {
      setBankListLoading(false);
    }
  };

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value).toFixed(2);
    
    if (!value || value.trim() === '') {
      setError('Please enter an amount');
      return false;
    }
    
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return false;
    }

    // Check against selected bank limits
    if (selectedBank) {
      // Use 10 as default minimum if not provided by API
      const minAmount = selectedBank.MinAmount || 10;
      
      if (numValue < minAmount) {
        setError(`Minimum amount is ₹${minAmount}`);
        return false;
      }

      if (selectedBank.MaxAmount && numValue > selectedBank.MaxAmount) {
        setError(`Maximum amount for ${selectedBank.Bank_name} is ₹${selectedBank.MaxAmount}`);
        return false;
      }
    }
    
    setError('');
    return true;
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized;
    
    setAmount(formatted);
    setSelectedQuickAmount(null); // Reset quick selection
    
    if (formatted) {
      validateAmount(formatted);
    } else {
      setError('');
    }
  };

  const handleQuickAmountSelect = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    setSelectedQuickAmount(quickAmount);
    validateAmount(quickAmount.toString());
  };

  const handlePayment = async () => {
    if (!validateAmount(amount)) {
      return;
    }

    if (!selectedBank) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    // Check if amount is within bank limits
    const minAmount = selectedBank.MinAmount || 10;

    if (parseFloat(amount) < minAmount) {
      Alert.alert(
        'Error',
        `Minimum amount is ₹${minAmount}`
      );
      return;
    }

    if (selectedBank.MaxAmount && parseFloat(amount) > selectedBank.MaxAmount) {
      Alert.alert(
        'Error',
        `Maximum amount for ${selectedBank.Bank_name} is ₹${selectedBank.MaxAmount}`
      );
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Call API to record payment request on server
      const payload = {
        Tokenid: userData.tokenid,
        Amount: parseFloat(amount),
        Version: Platform.OS === 'android' ? Platform.Version.toString() : '1',
        Location: userData.location || null,
      };
console.log('UPI Payment Payload:', payload);
      const response = await axios.post(`${BASE_URL}/UpiStcPay`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('UPI Payment Response:', response.data);

      if (response.data.STATUSCODE === '1' && response.data.MESSAGE === 'SUCCESS') {
        // Step 2: API call successful, now open UPI app with selected bank's UPI details
        const baseUrl = 'upi://pay';
        const params = new URLSearchParams({
          pa: selectedBank.UpiAdress,
          pn: selectedBank.HolderName,
          am: amount,
          cu: 'INR',
          tn: 'Add Money to Wallet',
          url: UPI_CALLBACK_URL,
        });

        const upiUrl = `${baseUrl}?${params.toString()}`;

        try {
          const canOpen = await Linking.canOpenURL(upiUrl);
          if (canOpen) {
            pendingUpiRef.current = true;
            await Linking.openURL(upiUrl);
            // After UPI app closes/transaction completes, navigate to Home
            setTimeout(() => {
              setAmount('');
              setSelectedQuickAmount(null);
            }, 1000);
          } else {
            pendingUpiRef.current = false;
            Alert.alert(
              'No UPI App Found',
              'Please install a UPI payment app (Google Pay, PhonePe, Paytm, etc.) to complete payment.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setAmount('');
                    setSelectedQuickAmount(null);
                  }
                }
              ]
            );
          }
        } catch (upiError) {
          pendingUpiRef.current = false;
          console.error('Error opening UPI app:', upiError);
          Alert.alert(
            'Payment Initiated',
            'Your payment request has been recorded. Please complete the payment manually.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setAmount('');
                  setSelectedQuickAmount(null);
                  navigation.navigate('Home');
                }
              }
            ]
          );
        }
      } else {
        Alert.alert(
          'Payment Failed',
          response.data.MESSAGE || 'Unable to process payment. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('UPI Payment Error:', err);
      Alert.alert(
        'Error',
        'Failed to initiate payment. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isPaymentDisabled = !amount || !!error || parseFloat(amount) < 10 || isLoading || !selectedBank;

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <Header headingTitle="Pay Via UPI" />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* Title */}

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter Amount</Text>
              <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={handleAmountChange}
                  maxLength={7}
                />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              {selectedBank && (
                <Text style={styles.limitText}>
                  {selectedBank.MaxAmount
                    ? `Amount range: ₹${selectedBank.MinAmount || 10} - ₹${selectedBank.MaxAmount}`
                    : `Minimum amount: ₹${selectedBank.MinAmount || 10}`}
                </Text>
              )}
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountContainer}>
              <Text style={styles.quickAmountLabel}>Quick Select</Text>
              <View style={styles.quickAmountGrid}>
                {[500, 1000, 2000, 4000, 5000].map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={[
                      styles.quickAmountButton,
                      selectedQuickAmount === quickAmount && styles.quickAmountButtonActive,
                    ]}
                    onPress={() => handleQuickAmountSelect(quickAmount)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.quickAmountText,
                        selectedQuickAmount === quickAmount && styles.quickAmountTextActive,
                      ]}
                    >
                      ₹{quickAmount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bank List Loading */}
            {bankListLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5856D6" />
                <Text style={styles.loadingText}>Loading payment methods...</Text>
              </View>
            ) : bankList.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No payment methods available</Text>
              </View>
            ) : (
              <>
                {/* Select Payment Method */}
                <Text style={styles.bankSelectionLabel}>Select Payment Method</Text>

                {/* Bank Cards */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.bankCardsContainer}
                  contentContainerStyle={styles.bankCardsContent}
                >
                  {bankList.map((bank) => (
                    <TouchableOpacity
                      key={bank.Bankid}
                      style={[
                        styles.bankCard,
                        selectedBank?.Bankid === bank.Bankid && styles.bankCardActive,
                      ]}
                      onPress={() => setSelectedBank(bank)}
                      activeOpacity={0.8}
                    >
                      {bank.images && (
                        <Image
                          source={{ uri: IMAGE_BASE_URL + bank.images }}
                          style={styles.bankImage}
                          resizeMode="contain"
                        />
                      )}
                      <Text style={styles.bankName}>{bank.Bank_name}</Text>
                      <Text style={styles.bankHolder}>{bank.HolderName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Selected Bank Details */}
                {selectedBank && (
                  <View style={styles.selectedBankInfo}>
                    <Text style={styles.selectedBankLabel}>Paying to:</Text>
                    <Text style={styles.selectedBankName}>{selectedBank.Bank_name}</Text>
                    <Text style={styles.selectedBankHolder}>{selectedBank.HolderName}</Text>
                  </View>
                )}
              </>
            )}

            {/* Payment Button */}
            <TouchableOpacity
              style={[
                styles.paymentButton,
                isPaymentDisabled && styles.paymentButtonDisabled,
              ]}
              onPress={handlePayment}
              disabled={isPaymentDisabled}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.paymentButtonText}>
                    {amount ? `Pay ₹${amount}` : 'Enter Amount to Continue'}
                  </Text>
                  <Text style={styles.paymentButtonSubtext}>
                    via UPI
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info Text */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                • Amount limits vary by payment method
              </Text>
              <Text style={styles.infoText}>
                • Money will be added to your wallet instantly
              </Text>
              <Text style={styles.infoText}>
                • Secure UPI payment gateway
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(8),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(24),
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(6),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(2),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputWrapperError: {
    borderColor: '#ff3b30',
  },
  currencySymbol: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#333',
    marginRight: horizontalScale(8),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#1a1a1a',
    padding: 0,
    paddingVertical: verticalScale(10),
  },
  errorText: {
    color: '#ff3b30',
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
    marginLeft: horizontalScale(8),
  },
  limitText: {
    color: '#0066cc',
    fontSize: moderateScale(11),
    marginTop: verticalScale(6),
    marginLeft: horizontalScale(8),
    fontWeight: '500',
  },
  
  // Quick Amount Styles
  quickAmountContainer: {
    marginBottom: verticalScale(24),
  },
  quickAmountLabel: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(10),
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    width: '18%',
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(4),
    marginBottom: verticalScale(8),
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickAmountButtonActive: {
    backgroundColor: '#5856D6',
    borderColor: '#5856D6',
  },
  quickAmountText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#333',
  },
  quickAmountTextActive: {
    color: '#fff',
  },
  
  // Payment Button Styles
  paymentButton: {
    backgroundColor: '#5856D6',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(24),
    elevation: 4,
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  paymentButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  paymentButtonText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: verticalScale(4),
  },
  paymentButtonSubtext: {
    fontSize: moderateScale(12),
    color: '#fff',
    opacity: 0.9,
  },

  // Loading & Error Styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
  },
  loadingText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(14),
    color: '#666',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
    backgroundColor: '#f5f5f5',
    borderRadius: moderateScale(10),
  },
  noDataText: {
    fontSize: moderateScale(14),
    color: '#999',
  },

  // Bank Selection Styles
  bankSelectionLabel: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(12),
    // marginTop: verticalScale(20),
  },
  bankCardsContainer: {
    marginBottom: verticalScale(16),
  },
  bankCardsContent: {
    paddingRight: horizontalScale(16),
  },
  bankCard: {
    width: horizontalScale(140),
    marginRight: horizontalScale(12),
    padding: horizontalScale(12),
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bankCardActive: {
    borderColor: '#5856D6',
    backgroundColor: '#f3f0ff',
  },
  bankImage: {
    width: horizontalScale(80),
    height: verticalScale(50),
    marginBottom: verticalScale(8),
  },
  bankName: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  bankHolder: {
    fontSize: moderateScale(11),
    color: '#666',
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },

  // Selected Bank Info Styles
  selectedBankInfo: {
    backgroundColor: '#f0f7ff',
    borderRadius: moderateScale(10),
    padding: horizontalScale(12),
    marginBottom: verticalScale(20),
    borderLeftWidth: 4,
    borderLeftColor: '#5856D6',
  },
  selectedBankLabel: {
    fontSize: moderateScale(12),
    color: '#999',
    marginBottom: verticalScale(4),
  },
  selectedBankName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#333',
  },
  selectedBankHolder: {
    fontSize: moderateScale(12),
    color: '#666',
    marginTop: verticalScale(4),
  },
  
  // Info Styles
  infoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: moderateScale(10),
    padding: moderateScale(14),
    borderLeftWidth: 4,
    borderLeftColor: '#5856D6',
    marginTop: verticalScale(8),
  },
  infoText: {
    fontSize: moderateScale(12),
    color: '#666',
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(18),
  },
});

export default PayUScreen;