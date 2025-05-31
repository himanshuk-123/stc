import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import { horizontalScale, verticalScale } from '../utils/responsive';
import WalletPayment from '../services/WalletPaymentService';
import { Constants } from 'expo';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const WalletPaymentScreen = ({ route }) => {
  const { scannedNumber } = route.params;
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState({});
  const [remark, setRemark] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userData = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
    try {
        const payload = {
            Tokenid:userData.tokenid,
            MobileNO:scannedNumber,
            Version:Constants?.expoConfig?.version?.split('.')[0] || '1',
            Location:null
        }
        const response = await WalletPayment.CheckWalletUser(
            payload.Tokenid,
            payload.MobileNO,
            payload.Version,
            payload.Location
        );
        console.log(response.data);
        setUser(response.data);
        if(response.data.STATUSCODE !== '1'){
            setShowErrorModal(true);
            setErrorMessage(response.data.MESSAGE);
          }
    } catch (error) {
        console.log(error);
    }finally{
      setLoading(false);
    }
    };
    fetchUserData();
  }, [scannedNumber]);


  const handleSubmit = async() => {
    if (!amount || !remark) {
      Alert.alert('Error', 'Please enter an amount and remark');
      return;
    }

    // Perform submission logic here
    const payload = {
      Tokenid:userData.tokenid,
      Amount:amount,
      UserID:user.USERID,
      Version:Constants?.expoConfig?.version?.split('.')[0] || '1',
      Location:null,
      Remark:remark,
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
    if(response.data.Error ==="0"){
      Alert.alert('Success', response.data.Message,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('MainTabs');
            }
          }
        ]
      );
    }else{
      Alert.alert('Error', response.data.Message);
    }
  };

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };

  if(loading){
    return <ActivityIndicator size="large" color="#0000ff" className='flex-1 justify-center items-center' />
  }
  return (
    <GradientLayout>
      <SafeAreaView style={{ paddingHorizontal: horizontalScale(16), paddingTop: verticalScale(16), flex: 1 }}>
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
        <Header headingTitle="Wallet Transfer" />

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ marginBottom: verticalScale(12) }}>
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>Name</Text>
            <TextInput
              value={user.Name}
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
            <Text style={{ fontWeight: '600', marginBottom: 4 }}>Mobile Number</Text>
            <TextInput
              value={user.MobileNO}
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
              }}
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
              }}
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
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default WalletPaymentScreen;
