/**
 * ReportsStack - Navigation stack for all report related screens
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import report related screens
import ReportsScreen from '../../screens/ReportsScreen';
import TransactionReportScreen from '../../screens/TransactionReportScreen';
import StandingReportScreen from '../../screens/StandingReportScreen';
import UserDayBookScreen from '../../screens/UserDayBookScreen';
import FundRequestListScreen from '../../screens/FundRequestListScreen';
import ReportsListScreen from '../../screens/ReportsListScreen';
import RechargeReportScreen from '../../screens/RechargeReportScreen';
import ComissionScreen from '../../screens/ComissionScreen';

const Stack = createNativeStackNavigator();

/**
 * Stack navigator for report related screens
 * This is not directly used in UI but is imported by AppNavigator
 * @returns {React.ReactElement} Stack navigator component
 */
const ReportsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportsMain" component={ReportsScreen} />
      <Stack.Screen name="TransactionReport" component={TransactionReportScreen} />
      <Stack.Screen name="StandingReport" component={StandingReportScreen} />
      <Stack.Screen name="UserDayBook" component={UserDayBookScreen} />
      <Stack.Screen name="FundRequestList" component={FundRequestListScreen} />
      <Stack.Screen name="ReportsList" component={ReportsListScreen} />
      <Stack.Screen name="RechargeReport" component={RechargeReportScreen} />
      <Stack.Screen name="Comission" component={ComissionScreen} />
    </Stack.Navigator>
  );
};

export default ReportsStack;
