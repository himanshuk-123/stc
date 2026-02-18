import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import { horizontalScale, moderateScale, verticalScale } from '../utils/responsive';

const PayUScreen = () => {
  const [amount, setAmount] = useState<string>('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const quickAmounts = [100, 200, 500, 1000, 2000];
  
  // UPI credentials - Replace with your actual UPI ID
  const UPI_ID = 'sandeepk101961@ibl'; // Replace this with your UPI ID
  const PAYEE_NAME = 'sandeep'; // Replace this with your name

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    
    if (!value || value.trim() === '') {
      setError('Please enter an amount');
      return false;
    }
    
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return false;
    }
    
    if (numValue < 10) {
      setError('Minimum amount is ₹10');
      return false;
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

    const baseUrl = 'upi://pay';
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: amount,
      cu: 'INR',
      tn: 'Add Money to Wallet',
    });

    const upiUrl = `${baseUrl}?${params.toString()}`;

    try {
      const canOpen = await Linking.canOpenURL(upiUrl);
      if (canOpen) {
        await Linking.openURL(upiUrl);
      } else {
        Alert.alert(
          'No UPI App Found',
          'Please install a UPI payment app (Google Pay, PhonePe, Paytm, etc.) to continue.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening UPI payment:', error);
      Alert.alert(
        'Payment Failed',
        'Unable to open UPI payment. Please try again or install a UPI app.',
        [{ text: 'OK' }]
      );
    }
  };

  const isPaymentDisabled = !amount || !!error || parseFloat(amount) < 10;

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
              <View style={styles.inputWrapper}>
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
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountContainer}>
              <Text style={styles.quickAmountLabel}>Quick Select</Text>
              <View style={styles.quickAmountGrid}>
                {quickAmounts.map((quickAmount) => (
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
              <Text style={styles.paymentButtonText}>
                {amount ? `Pay ₹${amount}` : 'Enter Amount to Continue'}
              </Text>
              <Text style={styles.paymentButtonSubtext}>
                via UPI
              </Text>
            </TouchableOpacity>

            {/* Info Text */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                • Minimum amount: ₹10
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