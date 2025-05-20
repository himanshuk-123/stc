import { View, Text, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import "./global.css"
import LoginScreen from './src/screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabRouter from './src/router/tabRouter'
import { LinearGradient } from 'expo-linear-gradient'
import AddMoneyScreen from './src/screens/AddMoneyScreen'
import RechargeScreen from './src/screens/RechargeScreen'
import ReportsScreen from './src/screens/ReportsScreen'
import NotificationScreen from './src/screens/NotificationScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import MobileRechargeScreen from './src/screens/MobileRechargeScreen'
import CompanyRechargeScreen from './src/screens/CompanyRechargeScreen'
import DTHRechargeScreen from './src/screens/DTHRechargeScreen'
import ComissionScreen from './src/screens/ComissionScreen'
import {  UserProvider } from './src/context/UserContext'
import RegisterScreen from './src/screens/RegisterScreen'
import TransactionReportScreen from './src/screens/TransactionReportScreen'
import ChangePasswordScreen from './src/screens/ChangePasswordScreen'
import OtpVerifyScreen from './src/screens/otpVerifyScreen'
import ForgetPasswordScreen from './src/screens/ForgetPasswordScreen'
import BalanceCheckScreen from './src/screens/BalanceCheckScreen'
import ComplainListScreen from './src/screens/ComplainListScreen'
import StandingReportScreen from './src/screens/StandingReportScreen'
import UserDayBookScreen from './src/screens/UserDayBookScreen'
import FundRequestListScreen from './src/screens/FundRequestListScreen'
import MemberListScreen from './src/screens/MemberListScreen'
import SupportScreen from './src/screens/SupportScreen'
import ContactScreen from './src/screens/ContactScreen'
const Stack = createNativeStackNavigator()
const App = () => {
  return (
    <>
    <UserProvider>
    <StatusBar backgroundColor="#0b0866" barStyle="light-content" hidden={false} />
    <LinearGradient
      colors={['#7ad6f0', '#ffffff']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TabRouter" component={TabRouter} options={{ headerShown: false }} />
            <Stack.Screen name="AddMoneyScreen" component={AddMoneyScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RechargeScreen" component={RechargeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MobileRechargeScreen" component={MobileRechargeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CompanyRechargeScreen" component={CompanyRechargeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DTHRechargeScreen" component={DTHRechargeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ComissionScreen" component={ComissionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TransactionReportScreen" component={TransactionReportScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OtpVerifyScreen" component={OtpVerifyScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BalanceCheckScreen" component={BalanceCheckScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ComplainListScreen" component={ComplainListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="StandingReportScreen" component={StandingReportScreen} options={{ headerShown: false }} />
            <Stack.Screen name="UserDayBookScreen" component={UserDayBookScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FundRequestListScreen" component={FundRequestListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MemberListScreen" component={MemberListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SupportScreen" component={SupportScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </LinearGradient>
    </UserProvider>
    </>
  )
}

export default App