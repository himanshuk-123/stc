import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';

const BookComplain = ({ route }) => {
  const [remark, setRemark] = useState('');
  const { operator } = route.params;
const data = {
  Date: operator.Date,
  RechargeID: operator.RechargeID,
  MobileNO: operator.MobileNO,
  Amount: operator.Amount,
  OrignalOperatorId: operator.OrignalOperatorId,
  Operator: operator.Operator,
}
  useEffect(() => {
    console.log("operator", operator);
    console.log("Recharge Id: ", operator.RechargeID)
    console.log("data Id: ", data.RechargeID)
    console.log("data: ", data.Amount)

  }, []);
// Example data — tum isse route.params se bhi le sakte ho
  const handleSubmit = () => {
    if (remark.trim() === '') {
      Alert.alert('Error', 'Please enter a remark');
      return;
    }

    // Yahan API call kar sakte ho
    console.log({
      ...operator,
      remark
    });

    Alert.alert('Submitted', 'Complaint submitted successfully');
  };

  return (
    <GradientLayout>
    <ScrollView contentContainerStyle={styles.container}>
      <Header headingTitle="Book Complaint" />

      {renderInput('Date', data.Date)}
      {renderInput('Recharge ID', data.RechargeID)}
      {renderInput('Mobile No.', data.MobileNO)}
      {renderInput('Amount', data.Amount)}
      {renderInput('Operator ID', data.OrignalOperatorId)}
      {renderInput('Operator', data.Operator)}
      {renderInput('Status', data.Status?data.Status:"Pending")}

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

const renderInput = (label, value) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} value={value} editable={false} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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
    backgroundColor: '#f2f2f2',
    color: '#333',
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
