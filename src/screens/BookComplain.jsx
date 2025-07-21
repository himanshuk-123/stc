import React, { useState } from 'react';
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

const BookComplain = ({ route }) => {
  const [remark, setRemark] = useState('');
  const { operator } = route.params;

  const handleSubmit = () => {
    if (remark.trim() === '') {
      Alert.alert('Error', 'Please enter a remark');
      return;
    }

    console.log({
      ...operator,
      remark,
    });

    Alert.alert('Submitted', 'Complaint submitted successfully');
  };

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
    color: '#555',
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
