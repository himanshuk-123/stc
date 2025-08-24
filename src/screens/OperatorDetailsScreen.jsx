import { View, Text, SafeAreaView, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';

const OperatorDetailsScreen = ({ route }) => {
  const { item,mode } = route.params;

  const [mobileNumber, setMobileNumber] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [billAmount, setBillAmount] = useState('');

  const handleProceed = () => {
    // 👉 Payment logic or navigate to confirmation
    console.log({
      item
    });
  };

  return (
    <GradientLayout>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: horizontalScale(16), paddingTop: verticalScale(16) }}>
        <Header headingTitle={mode || 'Postpaid'} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: verticalScale(20) }}>
            
            {/* Operator Image */}
            <Image
              source={{ uri: item.operatorImage }}
              style={{
                width: horizontalScale(60),
                height: verticalScale(60),
                borderRadius: 12,
                marginBottom: verticalScale(10),
              }}
              resizeMode="contain"
            />

            {/* Operator Name */}
            <Text style={{ fontSize: moderateScale(18), fontWeight: 'bold', color: '#333', marginBottom: verticalScale(20) }}>
              {item.operatorName}
            </Text>

            {/* Input Fields */}
            <TextInput
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              maxLength={10}
              style={inputStyle}
              placeholderTextColor="#888"
            />

            <TextInput
              placeholder="Customer Mobile Number"
              keyboardType="phone-pad"
              value={customerNumber}
              onChangeText={setCustomerNumber}
              maxLength={10}
              style={inputStyle}
              placeholderTextColor="#888"
            />

            <TextInput
              placeholder="Bill Amount"
              keyboardType="numeric"
              value={billAmount}
              onChangeText={setBillAmount}
              style={inputStyle}
              placeholderTextColor="#888"
            />

            {/* Proceed Button */}
            <TouchableOpacity
              onPress={handleProceed}
              style={{
                backgroundColor: '#00f2fe',
                marginTop: verticalScale(30),
                borderRadius: 10,
                paddingVertical: verticalScale(12),
                paddingHorizontal: horizontalScale(32),
                elevation: 2,
              }}
            >
              <Text style={{ color: 'white', fontSize: moderateScale(16), fontWeight: 'bold' }}>
                Proceed to Pay
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default OperatorDetailsScreen;

// ✨ Input box common style
const inputStyle = {
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: 10,
  paddingHorizontal: horizontalScale(16),
  paddingVertical: verticalScale(12),
  fontSize: moderateScale(15),
  color: '#333',
  marginBottom: verticalScale(16),
  elevation: 2,
};
