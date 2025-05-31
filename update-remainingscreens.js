/**
 * This is a template for updating the remaining screens to use Redux instead of Context API
 * 
 * For each of the screens below, make the following changes:
 * 
 * 1. Remove: import { useContext } from 'react';
 * 2. Remove: import { UserContext } from '../context/UserContext';
 * 3. Add:    import { useSelector } from 'react-redux';
 * 4. Replace: const { userData } = useContext(UserContext);
 *    With:    const userData = useSelector(state => state.user);
 * 
 * Files that need to be updated:
 * - src/screens/ComissionScreen.jsx
 * - src/screens/BalanceCheckScreen.jsx
 * - src/screens/DTHRechargeScreen.jsx
 * - src/screens/FundRequestListScreen.jsx
 * - src/screens/ContactScreen.jsx
 * - src/screens/MemberListScreen.jsx
 * - src/screens/MobileRechargeScreen.jsx
 * - src/screens/ComplainListScreen.jsx
 * - src/screens/otpVerifyScreen.jsx
 * - src/screens/RechargeReportScreen.jsx
 * - src/screens/TransactionReportScreen.jsx
 * - src/screens/UserDayBookScreen.jsx
 * - src/screens/SupportScreen.jsx
 * - src/screens/StandingReportScreen.jsx
 * 
 * Example update:
 * 
 * From:
 * ```
 * import React, { useContext } from 'react';
 * import { UserContext } from '../context/UserContext';
 * 
 * const MyScreen = () => {
 *   const { userData } = useContext(UserContext);
 *   
 *   // Rest of the component...
 * };
 * ```
 * 
 * To:
 * ```
 * import React from 'react';
 * import { useSelector } from 'react-redux';
 * 
 * const MyScreen = () => {
 *   const userData = useSelector(state => state.user);
 *   
 *   // Rest of the component...
 * };
 * ```
 */ 