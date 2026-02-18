import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Image
} from 'react-native';
import React, { useEffect, useState } from 'react';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import { horizontalScale, verticalScale } from '../utils/responsive';
import WalletPayment from '../services/WalletPaymentService';
// import { Constants } from 'expo';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../utils/authUtils';
import CustomButton from '../component/button';
import phone from '../../assets/phone_icon.png'
import MessageModal from '../modals/SuccessModal';

const WalletPaymentScreen = ({ route }) => {
  const { scannedNumber } = route.params || {};
  const navigation = useNavigation();
  const [number, setNumber] = useState(scannedNumber || '');
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState({});
  const [remark, setRemark] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userFound, setUserFound] = useState(!!scannedNumber); // ✅
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const userData = useSelector((state) => state.user);

  const fetchUserData = async () => {
    if (number.length !== 10) return; // only run when number is 10 digits

    setLoading(true);
    try {
      const payload = {
        Tokenid: userData.tokenid,
        MobileNO: number,
        Version: '1',
        Location: null,
      };

      const response = await WalletPayment.CheckWalletUser(
        payload.Tokenid,
        payload.MobileNO,
        payload.Version,
        payload.Location
      );

      console.log(response.data);
      setUser(response.data);

      if (response.data.STATUSCODE === '1') {
        setUserFound(true); // ✅ Show wallet form
      } else {
        setShowErrorModal(true);
        setErrorMessage(response.data.MESSAGE);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !remark) {
      setModalType('error');
      setSuccessMessage('Please enter an amount and remark');
      setShowSuccessModal(true);
      return;
    }
    setPaymentLoading(true);
    const payload = {
      Tokenid: userData.tokenid,
      Amount: amount,
      UserID: user.USERID,
      Version: '1',
      Location: null,
      Remark: remark,
    };

    console.log('Submitting:', payload);
    const response = await WalletPayment.Wallet(
      payload.Tokenid,
      payload.Amount,
      payload.UserID,
      payload.Version,
      payload.Location,
      payload.Remark
    );

    console.log(response.data);
    if (response.data.Error === '0') {
      setModalType('success');
      setSuccessMessage(response.data.Message);
      setShowSuccessModal(true);
    } else {
      setModalType('error');
      setSuccessMessage(response.data.Message);
      setShowSuccessModal(true);
    }
    setPaymentLoading(false);
  };

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    logout();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    if (modalType === 'success') {
      navigation.navigate('MainTabs');
    } else {
      navigation.goBack();
    }
  };

  const handleInputChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setNumber(cleaned); // always update number
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  return (
    <GradientLayout>
      <SafeAreaView
        style={{
          paddingHorizontal: horizontalScale(16),
          paddingTop: verticalScale(16),
          flex: 1,
        }}
      >
        <Modal
          visible={showErrorModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleErrorModalOk}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alert</Text>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleErrorModalOk}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <MessageModal
          visible={showSuccessModal}
          type={modalType}
          title={modalType === 'success' ? 'Success' : 'Error'}
          message={successMessage}
          onClose={handleSuccessModalClose}
          buttonText="OK"
          onButtonPress={handleSuccessModalClose}
        />

        <Header headingTitle="Wallet Transfer" />

        {!userFound ? (
          <View>
          <View style={styles.inputContainer}>
          <Image source={phone} style={{width:30,height:30}}/>
          <TextInput
              placeholder="Mobile Number"
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={number}
              onChangeText={handleInputChange}
              maxLength={10}
          />
          </View>
          <View>
            <CustomButton title='Search' onPress={fetchUserData}/>
          </View>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ marginBottom: verticalScale(12) }}>
              <Text style={{ fontWeight: '600', marginBottom: 4 }}>Name</Text>
              <TextInput
                value={user?.Name || ''}
                editable={false}
                style={{
                  backgroundColor: '#e5e5e5',
                  padding: 12,
                  borderRadius: 8,
                  color: 'gray',
                }}
              />
            </View>

            <View style={{ marginBottom: verticalScale(12) }}>
              <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                Mobile Number
              </Text>
              <TextInput
                value={number}
                editable={false}
                keyboardType="phone-pad"
                style={{
                  backgroundColor: 'white',
                  padding: 12,
                  borderRadius: 8,
                  color: 'gray',
                }}
                placeholderTextColor="gray"
              />
            </View>

            <View style={{ marginBottom: verticalScale(12) }}>
              <Text style={{ fontWeight: '600', marginBottom: 4 }}>Amount</Text>
              <TextInput
                placeholder="Enter Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={{
                  backgroundColor: 'white',
                  padding: 12,
                  borderRadius: 8,
                  color: '#4a4a4a'
                }}
                inputMode="numeric"
                maxLength={10}
                placeholderTextColor="gray"
              />
            </View>

            <View style={{ marginBottom: verticalScale(20) }}>
              <Text style={{ fontWeight: '600', marginBottom: 4 }}>Remark</Text>
              <TextInput
                placeholder="Enter Remark"
                value={remark}
                onChangeText={setRemark}
                style={{
                  backgroundColor: 'white',
                  padding: 12,
                  borderRadius: 8,
                  color: '#4a4a4a'
                }}
                inputMode="text"
                placeholderTextColor="gray"
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: '#007AFF',
                paddingVertical: verticalScale(14),
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              {paymentLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </GradientLayout>
  );
};

export default WalletPaymentScreen;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 20,
    height: 60
},
input: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 24,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a4a4a'
},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    marginHorizontal: 32,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
