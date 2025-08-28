/**
 * RechargeStack - Navigation stack for all recharge related screens
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import recharge related screens
import RechargeScreen from '../../screens/RechargeScreen';
import MobileRechargeScreen from '../../screens/MobileRechargeScreen';
import DTHRechargeScreen from '../../screens/DTHRechargeScreen';
import CompanyRechargeScreen from '../../screens/CompanyRechargeScreen';
import BrowsePlanScreen from '../../screens/BrowsePlanScreen';
import BrowsePlanStateSelection from '../../screens/BrowsePlanStateSelection';
import SpecialOffersScreen from '../../screens/SpecialOffersScreen';
import OperatorDetailsScreen from '../../screens/OperatorDetailsScreen';
import ProgressScreen from '../../screens/ProgressScreen';

const Stack = createNativeStackNavigator();

/**
 * Stack navigator for recharge related screens
 * This is not directly used in UI but is imported by AppNavigator
 * @returns {React.ReactElement} Stack navigator component
 */
const RechargeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RechargeMain" component={RechargeScreen} />
      <Stack.Screen name="MobileRecharge" component={MobileRechargeScreen} />
      <Stack.Screen name="DTHRecharge" component={DTHRechargeScreen} />
      <Stack.Screen name="CompanyRecharge" component={CompanyRechargeScreen} />
      <Stack.Screen name="BrowsePlan" component={BrowsePlanScreen} />
      <Stack.Screen name="BrowsePlanStateSelection" component={BrowsePlanStateSelection} />
      <Stack.Screen name="SpecialOffers" component={SpecialOffersScreen} />
      <Stack.Screen name="OperatorDetails" component={OperatorDetailsScreen} />
      <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
    </Stack.Navigator>
  );
};

export default RechargeStack;
