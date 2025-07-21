import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import CustomButton from '../component/button';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { useSelector } from 'react-redux';
import { handleRecharge } from '../component/Commonfunction';
//import Constants from 'expo-constants';
// PIN Input component
const PinInput = ({ value, showPin }) => {
    return (
      <View style={styles.pinContainer}>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={[styles.pinBox, value.length > index && styles.pinBoxFilled]}>
            {value.length > index && (
              <Text style={styles.pinText}>
                {showPin ? value[index] : '•'}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };
  

const EnterPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Get transaction details from route params
    const { MobileNo = '', Amount = '', opcodenew = '' } = route.params || {};
  const userData = useSelector(state => state.user);
//   const handleRecharge = async () => {
//     setLoading(true);


//     const payload = {
//         Token: userData.tokenid,
//         UserID: null,
//         RefTxnId: null,
//         MobileNo: mobileNumber,
//         Operator: opcodenew,
//         CricleId: "12",
//         Amount: amount,
//         Pin: pin,
//         CircleId: null,
//         MediumId: "1",
//         CircleCode: null,
//         AccountNo: null,
//         AccountOther: null,
//         Optional1: null,
//         Optional2: null,
//         Optional3: null,
//         Optional4: null,
//         Version: '1',
//         Location: null,
//     }
//     console.log(payload);
//     try {
//         const response = await RechargeService.RechargeCall(
//             payload.Token,
//             payload.UserID,
//             payload.RefTxnId,
//             payload.MobileNo,
//             payload.Operator,
//             payload.CricleId,
//             payload.Amount,
//             payload.Pin,
//             payload.CircleId,
//             payload.MediumId,
//             payload.CircleCode,
//             payload.AccountNo,
//             payload.AccountOther,
//             payload.Optional1,
//             payload.Optional2,
//             payload.Optional3,
//             payload.Optional4,
//             payload.Version,
//             payload.Location,
//         )
//         console.log(response.data);
//         Alert.alert(
//             response.data.STATUS,
//             response.data.MESSAGE,
//             [
//                 {
//                     text: 'OK',
//                     onPress: () => navigation.goBack()
//                 }
//             ]
//         );
//     } catch (error) {
//         console.error('Error during recharge:', error);
//         setError('An error occurred while processing the recharge. Please try again.');
//     } finally {
//         setLoading(false);
//     }
// }
  // Handle numeric input
  const handleNumberPress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const RechargeProceed = () => {
    handleRecharge({ userData, MobileNo, opcodenew, Amount, pin, navigation, setLoading, setError });
  }
  // Handle backspace
  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  // Handle confirm payment
  // const handleConfirmPayment = () => {
  //   if (pin.length === 4) {
  //     // TODO: Add payment confirmation logic
  //     console.log('Processing payment with PIN:', pin);
  //   }
  // };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <Header headingTitle="Enter Your PIN" />

        {/* PIN Input */}
        <View style={styles.pinSection}>
  <Text style={styles.pinLabel}>Enter 4-digit PIN</Text>

  <View style={styles.pinInputRow}>
    <PinInput value={pin} showPin={showPin} />
    <TouchableOpacity onPress={() => setShowPin(!showPin)} style={styles.eyeButton}>
      <Text style={styles.eyeIcon}>{showPin ? '🙈' : '👁️'}</Text>
    </TouchableOpacity>
  </View>
</View>


        {/* Number Pad */}
        <View style={styles.numberPad}>
  {[
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['', 0, '⌫'],
  ].map((row, rowIndex) => (
    <View key={rowIndex} style={styles.row}>
      {row.map((item, index) => {
        if (item === '') {
          return <View key={index} style={styles.emptyButton} />;
        }

        return (
          <TouchableOpacity
            key={index}
            style={styles.numberButton}
            onPress={() => {
              if (item === '⌫') handleBackspace();
              else if (typeof item === 'number') handleNumberPress(item);
            }}
          >
            <Text style={styles.numberText}>{item}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  ))}
</View>



        {/* Confirm Button */}
        <View style={styles.buttonContainer}>
          {loading ? <CustomButton title="Proceeding..." disabled /> : <CustomButton title="Proceed" onPress={RechargeProceed} disabled={pin.length !== 4} />}
          <TouchableOpacity
            style={styles.forgotPin}
            onPress={() => navigation.navigate('ChangePin')}
          >
            <Text style={styles.forgotPinText}>Change PIN?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(16),
  },
  detailsContainer: {
    marginTop: verticalScale(20),
  },
  detailsLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(8),
    color: '#333',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  detailTitle: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  detailValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#333',
  },
  pinSection: {
    marginTop: verticalScale(24),
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(16),
    color: '#333',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: horizontalScale(12),
  },
  pinBox: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: moderateScale(8),
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBoxFilled: {
    borderColor: '#4facfe',
  },
  pinDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: '#333',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: verticalScale(24),
  },
  numberButton: {
    width: horizontalScale(70),
    height: verticalScale(70),
    borderRadius: moderateScale(10),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  numberText: {
    fontSize: moderateScale(24),
    color: '#333',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: verticalScale(24),
  },
  forgotPin: {
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  forgotPinText: {
    fontSize: moderateScale(14),
    color: '#4facfe',
    fontWeight: '600',
  },
  pinInputRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  pinText: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    color: '#333',
  },
  
  eyeButton: {
    marginLeft: horizontalScale(10),
    padding: 4,
  },
  
  eyeIcon: {
    fontSize: moderateScale(20),
  },
  
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: verticalScale(12),
    gap: moderateScale(20),
  },
  emptyButton: {
    width: horizontalScale(70),
    height: verticalScale(70),
  },
  
});

export default EnterPinScreen;