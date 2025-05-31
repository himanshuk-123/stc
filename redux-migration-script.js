/**
 * Redux Migration Guide
 * 
 * This is a reference file for migrating all remaining components from Context API to Redux.
 * For each component that uses the UserContext, follow these steps:
 * 
 * 1. Change import statements:
 *    - Remove: import { useContext } from 'react';
 *    - Remove: import { UserContext } from '../context/UserContext';
 *    - Add:    import { useDispatch, useSelector } from 'react-redux';
 *    - Add necessary imports like: import { clearUserData, saveUserData } from '../redux/slices/userSlice';
 * 
 * 2. Replace context usage:
 *    - Change: const { userData } = useContext(UserContext);
 *    - To:     const userData = useSelector(state => state.user);
 * 
 * 3. Replace context actions:
 *    - Change: const { saveUserData, clearUserData } = useContext(UserContext);
 *             saveUserData(data);
 *             clearUserData();
 *    - To:     const dispatch = useDispatch();
 *             dispatch(saveUserData(data));
 *             dispatch(clearUserData());
 * 
 * 4. Update the component logic as needed
 * 
 * Files that need to be updated (based on grep search results):
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
 * - src/screens/RegisterScreen.jsx
 * - src/screens/CompanyRechargeScreen.jsx
 * - src/screens/TransactionReportScreen.jsx
 * - src/screens/UserDayBookScreen.jsx
 * - src/screens/SupportScreen.jsx
 * - src/screens/StandingReportScreen.jsx
 * 
 * Example of a migration:
 * 
 * Before:
 * ```
 * import React, { useContext } from 'react';
 * import { UserContext } from '../context/UserContext';
 * 
 * const MyComponent = () => {
 *   const { userData, saveUserData, clearUserData } = useContext(UserContext);
 *   
 *   const handleSave = () => {
 *     saveUserData({ username: 'new name' });
 *   };
 *   
 *   const handleLogout = () => {
 *     clearUserData();
 *   };
 *   
 *   return (...);
 * };
 * ```
 * 
 * After:
 * ```
 * import React from 'react';
 * import { useDispatch, useSelector } from 'react-redux';
 * import { saveUserData, clearUserData } from '../redux/slices/userSlice';
 * 
 * const MyComponent = () => {
 *   const userData = useSelector(state => state.user);
 *   const dispatch = useDispatch();
 *   
 *   const handleSave = () => {
 *     dispatch(saveUserData({ username: 'new name' }));
 *   };
 *   
 *   const handleLogout = () => {
 *     dispatch(clearUserData());
 *   };
 *   
 *   return (...);
 * };
 * ```
 */ 