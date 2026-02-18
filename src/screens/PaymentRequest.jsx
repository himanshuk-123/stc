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
  SafeAreaView,
  Platform
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
  const [remark, setRemark] = useState(null);
  const [amountRestriction, setAmountRestriction] = useState({
    min: 0,
    max: 10000
  });
  const [amountError, setAmountError] = useState('');
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

  // Update amount restrictions when a bank is selected
  useEffect(() => {
    if (selectedBank) {
      // Set min and max amount from selected bank
      // Convert to numbers to ensure correct comparison
      const minAmount = parseFloat(selectedBank.MinAmount) || 0;
      const maxAmount = parseFloat(selectedBank.MaxAmount) || 10000;
      
      setAmountRestriction({
        min: minAmount,
        max: maxAmount
      });
      
      // Clear amount when bank changes to force re-entry
      setAmount('');
      setAmountError('');
    }
  }, [selectedBankId, selectedBank]);

  // Validate amount against min/max constraints
  const validateAmount = (value) => {
    if (!value) return 'Amount is required';
    
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'Please enter a valid number';
    
    if (numericValue < amountRestriction.min) {
      return `Minimum amount is ₹${amountRestriction.min}`;
    }
    
    if (numericValue > amountRestriction.max) {
      return `Maximum amount is ₹${amountRestriction.max}`;
    }
    
    return ''; // No error
  };

  // Handle amount change with validation
  const handleAmountChange = (value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
    
    // Validate and set error
    if (numericValue) {
      setAmountError(validateAmount(numericValue));
    } else {
      setAmountError('');
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    if (!selectedBankId) {
      alert('Please select a bank');
      return;
    }
    
    if (!reference) {
      alert('Please enter a reference number');
      return;
    }
    
    // Validate amount
    const amountValidationError = validateAmount(amount);
    if (amountValidationError) {
      setAmountError(amountValidationError);
      alert(amountValidationError);
      return;
    }
    const payload = {
      Tokenid: userData.tokenid,
      RequestTo: 'Admin',
      Amount: amount,
      SecAmt: null,
      Mode: 4,
      Bankid: selectedBankId,
      WalletType: 1,
      RefrenceNo:reference,
      Remark: remark,
      Response: null,
      Version: Platform.Version.toString(),
      Location: userData.Location
    }
    console.log("himanshu bhai ki jai")
    try {
      const response = await BankService.PaymentRequest(payload);
      console.log(payload)
      console.log('Payment Request Response:', response.data);
  
      navigation.navigate('ProgressScreen',{Time:response.data.Time});
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
                    <View style={[styles.inputContainer, amountError ? styles.inputError : null]}>
            <Text style={{ fontSize: 38, color: 'red' }}>₹</Text>
            <TextInput
              placeholder="Amount"
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={amount}
              onChangeText={handleAmountChange}
              textContentType="none"
              importantForAutofill="no"
              maxLength={10}
            />
          </View>
          
          {amountError ? (
            <Text style={styles.errorText}>{amountError}</Text>
          ) : null}

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
                <Picker.Item 
                  key={bank.Bankid} 
                  label={`${bank.Bank_name} `} 
                  value={bank.Bankid} 
                />
              ))}
            </Picker>
          </View>
{/*           
          {selectedBankId && (
            <View style={styles.bankLimitsContainer}>
              <Text style={styles.bankLimitsText}>
                Amount Range: ₹{amountRestriction.min} - ₹{amountRestriction.max}
              </Text>
            </View>
          )} */}
          <View style={{backgroundColor:'white',borderRadius:50,overflow:'hidden',marginBottom:16,borderWidth:1,borderColor:'black',height:60}}>
          <TextInput
            placeholder="Enter Reference Number"
            value={reference}
            onChangeText={setReference}
            style={{flex:1,paddingVertical:8,paddingLeft:24,fontSize:18,fontWeight:'bold',color:'#4a4a4a'}}
            placeholderTextColor="#888"
          />
          </View>
          <View style={{backgroundColor:'white',borderRadius:50,overflow:'hidden',marginBottom:16,borderWidth:1,borderColor:'black',height:60}}>
          <TextInput
            placeholder="Remark (Optional)"
            value={remark}
            onChangeText={setRemark}
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 10,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  bankLimitsContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#b0e0e6',
  },
  bankLimitsText: {
    color: '#0000cd',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentScreen;
