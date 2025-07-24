import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import RechargeApiServices from '../services/RechargeService';
import { useAppSelector } from '../redux/hooks';
import { useNavigation } from '@react-navigation/native';
const BookComplain = ({ route }) => {
  const [remark, setRemark] = useState('');
  const { operator } = route.params;
  const userData = useAppSelector((state) => state.user);
  const navigation = useNavigation();
  const handleSubmit = async () => {
    if (remark.trim() === '') {
      Alert.alert('Error', 'Please enter a remark');
      return;
    }

    try {
      const response = await RechargeApiServices.BookComplain(
        userData.tokenid,
         operator.RechargeID,
          remark,
          userData.version,
          userData.location
        );
        console.log(response);
      if (response.status === 200) {
        Alert.alert('Success', 'Complaint submitted successfully', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(operator);
  }, [operator]);

  return (
    <GradientLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Header headingTitle="Book Complaint" />

        {renderInput('Date', operator.Date)}
        {renderInput('Recharge ID', operator.RechargeID ? String(operator.RechargeID) : '0000000000')}
        {renderInput('Mobile No.', operator.MobileNO ? String(operator.MobileNO) : '0000000000')}
        {renderInput('Amount', operator.Amount ? String(operator.Amount) : '0.00')}
        {renderInput('Operator ID', operator.OrignalOperatorId ? String(operator.OrignalOperatorId) : '0000000000')}
        {renderInput('Operator', operator.Operator ? operator.Operator : 'Unknown')}
        {renderInput('Status', operator.Status ? operator.Status : 'Pending')}

        <Text style={styles.label}>Remark</Text>
        <TextInput
          style={[styles.input, styles.editable]}
          placeholder="Enter your remark"
          value={remark}
          onChangeText={setRemark}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Complaint</Text>
        </TouchableOpacity>
      </ScrollView>
    </GradientLayout>
  );
};

// ✅ Helper for rendering non-editable fields
const renderInput = (label, value) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value !== undefined && value !== null ? String(value) : ''}
      editable={false}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: 'black',
  },
  editable: {
    backgroundColor: '#fff',
    borderColor: '#007bff',
  },
  button: {
    backgroundColor: '#007bff',
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BookComplain;
