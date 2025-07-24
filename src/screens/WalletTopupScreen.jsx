import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import CustomButton from '../component/button';
import WalletPayment from '../services/WalletPaymentService';
import { useNavigation } from '@react-navigation/native';
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
          Version: "1",
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
      <SafeAreaView style={styles.container}>
        <Header headingTitle="Wallet Topup" screenName="WalletTopupScreen" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedUser}
                onValueChange={(itemValue) => setSelectedUser(itemValue)}
                style={styles.picker}
                dropdownIconColor="#000"
              >
                <Picker.Item label="Select a user..." value={null} />
                {data.map((item) => (
                  <Picker.Item
                    key={item.Userid.toString()}
                    label={`${item.FullName} ${item.MobileNumber}`}
                    value={item.Userid}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.amountContainer}>
             <Text style={{fontSize:38,color: 'red'}}>₹</Text>
              <TextInput
                placeholder="Amount"
                style={styles.amountInput}
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <Text style={styles.transactionTypeText}>Transaction Type</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                onPress={() => setTransactionType('TOPUP')}
                style={styles.radioButton}
              >
                <View style={styles.radioOuter}>
                  {transactionType === 'TOPUP' && <View style={styles.radioInner} />}
                </View>
                <Text style={{color:'black'}}>Topup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTransactionType('PULLOUT')}
                style={styles.radioButton}
              >
                <View style={styles.radioOuter}>
                  {transactionType === 'PULLOUT' && <View style={styles.radioInner} />}
                </View>
                <Text style={{color:'black'}}>Pullout</Text>
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  scrollView: {
    flex: 1
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16
  },
  picker: {
    color: '#000000',
    height: 50
  },
  amountContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'black',
    height: 60
  },
  amountInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#374151',
    paddingLeft: 24,
    fontWeight: 'bold',
    fontSize: 24
  },
  transactionTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black'
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  radioInner: {
    height: 16,
    width: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8
  }
});

export default WalletTopupScreen;
