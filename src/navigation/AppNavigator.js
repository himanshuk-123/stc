import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Tab Router
import TabRouter from '../router/tabRouter';

// Import main app screens
import AddMoneyScreen from '../screens/AddMoneyScreen';
import RechargeScreen from '../screens/RechargeScreen';
import ReportsScreen from '../screens/ReportsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MobileRechargeScreen from '../screens/MobileRechargeScreen';
import CompanyRechargeScreen from '../screens/CompanyRechargeScreen';
import DTHRechargeScreen from '../screens/DTHRechargeScreen';
import ComissionScreen from '../screens/ComissionScreen';
import TransactionReportScreen from '../screens/TransactionReportScreen';
import BalanceCheckScreen from '../screens/BalanceCheckScreen';
import ComplainListScreen from '../screens/ComplainListScreen';
import StandingReportScreen from '../screens/StandingReportScreen';
import UserDayBookScreen from '../screens/UserDayBookScreen';
import FundRequestListScreen from '../screens/FundRequestListScreen';
import MemberListScreen from '../screens/MemberListScreen';
import SupportScreen from '../screens/SupportScreen';
import ContactScreen from '../screens/ContactScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import EnterPinScreen from '../screens/EnterPinScreen';
import QrScanner from '../screens/QrScanner';
import WalletPaymentScreen from '../screens/WalletPaymentScreen';
import WalletTopupScreen from '../screens/WalletTopupScreen';
import BrowsePlanScreen from '../screens/BrowsePlanScreen';
import ChangePinScreen from '../screens/ChangePinScreen';
import ReportsListScreen from '../screens/ReportsListScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabRouter} />
      <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
      <Stack.Screen name="Recharge" component={RechargeScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MobileRecharge" component={MobileRechargeScreen} />
      <Stack.Screen name="CompanyRecharge" component={CompanyRechargeScreen} />
      <Stack.Screen name="DTHRecharge" component={DTHRechargeScreen} />
      <Stack.Screen name="Comission" component={ComissionScreen} />
      <Stack.Screen name="TransactionReport" component={TransactionReportScreen} />
      <Stack.Screen name="BalanceCheck" component={BalanceCheckScreen} />
      <Stack.Screen name="ComplainList" component={ComplainListScreen} />
      <Stack.Screen name="StandingReport" component={StandingReportScreen} />
      <Stack.Screen name="UserDayBook" component={UserDayBookScreen} />
      <Stack.Screen name="FundRequestList" component={FundRequestListScreen} />
      <Stack.Screen name="MemberList" component={MemberListScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="EnterPin" component={EnterPinScreen} />
      <Stack.Screen name="QrScanner" component={QrScanner} />
      <Stack.Screen name="WalletPayment" component={WalletPaymentScreen} />
      <Stack.Screen name="WalletTopup" component={WalletTopupScreen} />
      <Stack.Screen name="BrowsePlan" component={BrowsePlanScreen} />
      <Stack.Screen name="ChangePin" component={ChangePinScreen} />
      <Stack.Screen name="ReportsList" component={ReportsListScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 