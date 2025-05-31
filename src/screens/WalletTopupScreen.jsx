import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import CustomButton from '../component/button';
import WalletPayment from '../services/WalletPaymentService';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import ReportService from '../services/reportService';
const WalletTopupScreen = ({ route }) => {
  const { userId } = route.params;
    const userData = useSelector(state => state.user);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(userId||null);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('TOPUP');
  const [smsOff, setSmsOff] = useState('OFF');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const MemberList = async () => {
      setLoading(true);
      try {
        const payload = {
            Tokenid: userData.tokenid,
            Version: Constants?.expoConfig?.version?.split(".")[0] || "1",
            Location: null,
        };

        const response = await ReportService.MEMBERLIST(
          payload.Tokenid,
          payload.Version,
          payload.Location
        );
        const data = response.data;
        console.log("Himanshu Kasoudhan: ",data)
        if(data.STATUSCODE !== '1'){
          setShowErrorModal(true);
          setErrorMessage(data.MESSAGE);
        }
        if(data.ERROR === '0'){
          if(data.MEMBERLIST==null){
            Alert.alert("Error", data.MESSAGE,
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]
          );
        }else{
          setData(data.MEMBERLIST);
        }
      }
        else{
          Alert.alert("Error", data.MESSAGE,
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]
          );
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

        MemberList(); // Fetch all on mount
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try{
    const payload = {
        Tokenid:userData.tokenid,
        UserID:selectedUser ,
        TYPE:transactionType,
        Amount:amount,
        WalletType:"1",
        Remark:null,
        SMS:smsOff,
        Version:userData.version,
        Location:null,
    };
    console.log('Submit Payload:', payload);
    const response = await WalletPayment.WalletTopup(
        payload.Tokenid,
        payload.UserID,
        payload.TYPE,
        payload.Amount,
        payload.WalletType,
        payload.Remark,
        payload.SMS,
        payload.Version,
        payload.Location
    );
    console.log('Response:', response.data);
    if(response.data.Error === "0"){
        Alert.alert(
            'Success',
            response.data.Message,
            [
                {
                    text: 'OK',
                    onPress: () => navigation.replace('MainTabs')
                }
            ]
        );
    }else{
        Alert.alert('Error', response.data.Message);
    }
    }catch(error){
        console.log('Error:', error);
    }finally{
        setLoading(false);
    }
  };

  return (
    <GradientLayout>
      <SafeAreaView className="p-4 flex-1">
        <Header headingTitle="Wallet Topup" screenName="WalletTopupScreen" />
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-xl p-6">
            <View className="border border-black rounded-full overflow-hidden mb-4">
              <Picker
                selectedValue={selectedUser}
                onValueChange={(itemValue) => setSelectedUser(itemValue)}
              >
                <Picker.Item label="Select a user" value={null} />
                {data.map((item) => (
                  <Picker.Item
                    key={item.Userid.toString()}
                    label={`${item.FullName} (${item.MobileNumber})`}
                    value={item.Userid}
                  />
                ))}
              </Picker>
            </View>

            <View className="bg-white rounded-full flex-row items-center px-6 mb-4 border border-black" style={{ height: 60 }}>
              <FontAwesome name="rupee" size={36} color="#f72343" />
              <TextInput
                placeholder="Amount"
                className="flex-1 py-2 text-gray-700 pl-6 font-bold text-2xl"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <Text className="text-lg font-bold mb-2">Transaction Type</Text>
            <View className="flex-row mb-4">
              <TouchableOpacity
                onPress={() => setTransactionType('TOPUP')}
                className="flex-row items-center mr-4"
              >
                <View className="h-6 w-6 rounded-full border border-gray-400 items-center justify-center mr-2">
                  {transactionType === 'TOPUP' && <View className="h-4 w-4 bg-blue-500 rounded-full" />}
                </View>
                <Text>Topup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTransactionType('PULLOUT')}
                className="flex-row items-center"
              >
                <View className="h-6 w-6 rounded-full border border-gray-400 items-center justify-center mr-2">
                    {transactionType === 'PULLOUT' && <View className="h-4 w-4 bg-blue-500 rounded-full" />}
                </View>
                <Text>Pullout</Text>
              </TouchableOpacity>
            </View>


            <View className="flex-row items-center mb-5 mt-5 ">
              <Checkbox
                value={smsOff === 'ON'}
                onValueChange={() => setSmsOff(smsOff === 'OFF' ? 'ON' : 'OFF')}
              />
              <Text className="ml-2">{`SMS ${smsOff}`}</Text>
            </View>

            <CustomButton
            title={loading ? 'Submitting...' : 'Submit'}
            onPress={handleSubmit}
            disabled={loading}
          />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default WalletTopupScreen;
