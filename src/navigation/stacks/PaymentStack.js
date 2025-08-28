/**
 * PaymentStack - Navigation stack for all payment related screens
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import payment related screens
import AddMoneyScreen from '../../screens/AddMoneyScreen';
import WalletPaymentScreen from '../../screens/WalletPaymentScreen';
import WalletTopupScreen from '../../screens/WalletTopupScreen';
import PaymentRequest from '../../screens/PaymentRequest';
import BillPaymentsScreen from '../../screens/BillPaymentsScreen';
import QrScanner from '../../screens/QrScanner';

const Stack = createNativeStackNavigator();

/**
 * Stack navigator for payment related screens
 * This is not directly used in UI but is imported by AppNavigator
 * @returns {React.ReactElement} Stack navigator component
 */
const PaymentStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
      <Stack.Screen name="WalletPayment" component={WalletPaymentScreen} />
      <Stack.Screen name="WalletTopup" component={WalletTopupScreen} />
      <Stack.Screen name="PaymentRequest" component={PaymentRequest} />
      <Stack.Screen name="BillPayments" component={BillPaymentsScreen} />
      <Stack.Screen name="QrScanner" component={QrScanner} />
    </Stack.Navigator>
  );
};

export default PaymentStack;
