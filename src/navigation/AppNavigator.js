/**
 * AppNavigator - Main navigation container for authenticated users
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import navigation configuration
import { ROUTES, SCREEN_OPTIONS } from './NavigationConfig';

// Import Tab Router
import TabRouter from '../router/tabRouter';

// Import stack navigators
import RechargeStack from './stacks/RechargeStack';
import ReportsStack from './stacks/ReportsStack';
import PaymentStack from './stacks/PaymentStack';
import ProfileStack from './stacks/ProfileStack';
import SupportStack from './stacks/SupportStack';

// Import screens that don't fit into specific stacks
import NotificationScreen from '../screens/NotificationScreen';
import HomeScreen2 from '../screens/HomeScreen2';
import PrintScreen from '../screens/PrintScreen';

const Stack = createNativeStackNavigator();

/**
 * Main app navigator for authenticated users
 * Uses stack navigation with tab navigation nested inside
 * @returns {React.ReactElement} Stack navigator component
 */
const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName={ROUTES.APP.MAIN_TABS}
      screenOptions={SCREEN_OPTIONS.DEFAULT}
    >
      {/* Main tab navigation */}
      <Stack.Screen name={ROUTES.APP.MAIN_TABS} component={TabRouter} />
      
      {/* Feature-specific stack navigators */}
      <Stack.Screen name="RechargeStack" component={RechargeStack} options={{ headerShown: false }} />
      <Stack.Screen name="ReportsStack" component={ReportsStack} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentStack" component={PaymentStack} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} options={{ headerShown: false }} />
      <Stack.Screen name="SupportStack" component={SupportStack} options={{ headerShown: false }} />
      
      {/* Standalone screens */}
      <Stack.Screen name={ROUTES.APP.NOTIFICATION} component={NotificationScreen} />
      <Stack.Screen name={ROUTES.APP.HOME_SCREEN_2} component={HomeScreen2} />
      <Stack.Screen name={ROUTES.APP.PRINT_SCREEN} component={PrintScreen} />
      
      {/* For backward compatibility - these will be removed after migrating to stack navigators */}
      {/* Individual screens listed here for backward compatibility during migration */}
      <Stack.Group>
        {/* Recharge screens */}
        <Stack.Screen name="Recharge" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.MAIN }} />
        <Stack.Screen name="MobileRecharge" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.MOBILE }} />
        <Stack.Screen name="DTHRecharge" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.DTH }} />
        <Stack.Screen name="CompanyRecharge" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.COMPANY }} />
        <Stack.Screen name="BrowsePlan" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.BROWSE_PLAN }} />
        <Stack.Screen name="BrowsePlanStateSelection" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.BROWSE_PLAN_STATE }} />
        <Stack.Screen name="SpecialOffers" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.SPECIAL_OFFERS }} />
        <Stack.Screen name="OperatorDetails" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.OPERATOR_DETAILS }} />
        <Stack.Screen name="ProgressScreen" component={RechargeStack} initialParams={{ screen: ROUTES.RECHARGE.PROGRESS }} />
        
        {/* Payment screens */}
        <Stack.Screen name="AddMoney" component={PaymentStack} initialParams={{ screen: ROUTES.PAYMENT.ADD_MONEY }} />
        <Stack.Screen name="WalletPayment" component={PaymentStack} initialParams={{ screen: ROUTES.PAYMENT.WALLET_PAYMENT }} />
        <Stack.Screen name="WalletTopup" component={PaymentStack} initialParams={{ screen: ROUTES.PAYMENT.WALLET_TOPUP }} />
        <Stack.Screen name="PaymentRequest" component={PaymentStack} initialParams={{ screen: ROUTES.PAYMENT.PAYMENT_REQUEST }} />
        <Stack.Screen name="BillPayments" component={PaymentStack} initialParams={{ screen: ROUTES.PAYMENT.BILL_PAYMENTS }} />
        <Stack.Screen name="QrScanner" component={PaymentStack} initialParams={{ screen: ROUTES.PAYMENT.QR_SCANNER }} />
        
        {/* Reports screens */}
        <Stack.Screen name="Reports" component={ReportsStack} initialParams={{ screen: ROUTES.REPORTS.MAIN }} />
        <Stack.Screen name="TransactionReport" component={ReportsStack} initialParams={{ screen: ROUTES.REPORTS.TRANSACTION }} />
        <Stack.Screen name="StandingReport" component={ReportsStack} initialParams={{ screen: ROUTES.REPORTS.STANDING }} />
        <Stack.Screen name="UserDayBook" component={ReportsStack} initialParams={{ screen: ROUTES.REPORTS.USER_DAY_BOOK }} />
        <Stack.Screen name="FundRequestList" component={ReportsStack} initialParams={{ screen: ROUTES.REPORTS.FUND_REQUEST_LIST }} />
        <Stack.Screen name="ReportsList" component={ReportsStack} initialParams={{ screen: ROUTES.REPORTS.REPORTS_LIST }} />
        <Stack.Screen name="RechargeReport" component={ReportsStack} initialParams={{ screen: ROUTES.REPORTS.RECHARGE_REPORT }} />
        <Stack.Screen name="Comission" component={ReportsStack} initialParams={{ screen: ROUTES.REPORTS.COMMISSION }} />
        
        {/* Profile screens */}
        <Stack.Screen name="Profile" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.MAIN }} />
        <Stack.Screen name="ChangePassword" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.CHANGE_PASSWORD }} />
        <Stack.Screen name="ChangePin" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.CHANGE_PIN }} />
        <Stack.Screen name="EnableDisablePin" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.ENABLE_DISABLE_PIN }} />
        <Stack.Screen name="EnterPin" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.ENTER_PIN }} />
        <Stack.Screen name="MemberList" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.MEMBER_LIST }} />
        <Stack.Screen name="AddUser" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.ADD_USER }} />
        
        {/* Support screens */}
        <Stack.Screen name="Support" component={SupportStack} initialParams={{ screen: ROUTES.SUPPORT.MAIN }} />
        <Stack.Screen name="Contact" component={SupportStack} initialParams={{ screen: ROUTES.SUPPORT.CONTACT }} />
        <Stack.Screen name="ComplainList" component={SupportStack} initialParams={{ screen: ROUTES.SUPPORT.COMPLAIN_LIST }} />
        <Stack.Screen name="BookComplain" component={SupportStack} initialParams={{ screen: ROUTES.SUPPORT.BOOK_COMPLAIN }} />
        
        {/* Other screens */}
        <Stack.Screen name="Register" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.ADD_USER }} />
        <Stack.Screen name="OtpVerify" component={ProfileStack} initialParams={{ screen: ROUTES.PROFILE.ADD_USER }} />
        <Stack.Screen name="Services" component={TabRouter} initialParams={{ screen: ROUTES.APP.SERVICES }} />
        <Stack.Screen name="MoreScreen" component={TabRouter} initialParams={{ screen: ROUTES.APP.MORE }} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigator;