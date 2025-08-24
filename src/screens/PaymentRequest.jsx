import React, { useEffect, useState ,useRef} from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import BankService from '../services/BankService';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import CustomButton from '../component/button';
import { useNavigation } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';

const PaymentScreen = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState();
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(true);
  const userData = useSelector(state => state.user);
    const viewShotRef = useRef();
  
  const navigation = useNavigation();
  const fetchBankList = async () => {
    try {
      const response = await BankService.BankList(
        userData.tokenid,
        1,
        null
      );
      console.log(response);
      const list = response.data.BANKLIST || [];
      const filtered = list.filter(bank => bank.images !== null);
      setBanks(filtered);
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

    const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      await Share.open({
        url: uri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error) {
      console.error('QR share error:', error);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, []);

  const selectedBank = banks.find(bank => bank.Bankid === selectedBankId);

  const handleSubmit = async () => {
    if (!amount || !reference || !selectedBankId) {
      alert('Please fill all fields');
      return;
    }
  
    try {
      const response = await BankService.PaymentRequest(
        userData.tokenid,
        'Admin',
        amount,
        null,
        '4',
        selectedBankId,
        '1',
        reference,
        null,
        null,
        1,
        null
      );
  
      console.log('Payment Request Response:', response.data);
  
      // ✅ Navigate to Progress screen
      navigation.navigate('ProgressScreen');
    } catch (err) {
      console.error('Payment Request Error:', err);
      alert('Something went wrong!');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GradientLayout>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Header headingTitle={"Payment Request"} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputContainer}>
            <Text style={{ fontSize: 38, color: 'red' }}>₹</Text>
            <TextInput
              placeholder="Amount"
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              textContentType="none"
              importantForAutofill="no"
              maxLength={5}
            />

          </View>

          {/* <Text style={styles.label}>Select Bank</Text> */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBankId}
              onValueChange={(itemValue) => setSelectedBankId(itemValue)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="-- Select Bank --" value={null} />
              {banks.map((bank) => (
                <Picker.Item key={bank.Bankid} label={bank.Bank_name} value={bank.Bankid} />
              ))}
            </Picker>
          </View>
          <View style={{backgroundColor:'white',borderRadius:50,overflow:'hidden',marginBottom:16,borderWidth:1,borderColor:'black',height:60}}>
          <TextInput
            placeholder="Enter Reference Number"
            value={reference}
            onChangeText={setReference}
            style={{flex:1,paddingVertical:8,paddingLeft:24,fontSize:18,fontWeight:'bold',color:'#4a4a4a'}}
            placeholderTextColor="#888"
          />
          </View>
          <View style={{marginBottom: 12}}><CustomButton title="Submit" onPress={handleSubmit}/></View>
          {selectedBank?.images && (  
            <>
              <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
            <View style={{alignItems:'center',justifyContent:'center',marginBottom:16}}>
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${selectedBank.images}` }}
              style={styles.qrImage}
              resizeMode="contain"
            />
            </View>
            </ViewShot>
            <View style={{width: '100%',justifyContent: 'center',alignItems: 'center'}}>
            <View >
              <Button title='Share Qr Code'  onPress={handleShare}/>
            </View>
            </View>
          </>
          )}

        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrImage: {
    width: '60%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'white'
  },
  picker: {
    color: '#000000',
    height: 50
  },
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
});

export default PaymentScreen;
