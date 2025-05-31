/**
 * THIS FILE IS DEPRECATED - NOW REPLACED BY REDUX
 * 
 * Please use the Redux implementation instead:
 * - Import user state: import { useSelector } from 'react-redux'
 * - Access user data: const userData = useSelector(state => state.user)
 * - Update user data: import { useDispatch } from 'react-redux'
 *                     import { saveUserData } from '../redux/slices/userSlice'
 *                     const dispatch = useDispatch()
 *                     dispatch(saveUserData({ ... }))
 * 
 * This file will be removed once all components have been migrated to Redux.
 */

// // context/UserContext.js
// import React, { createContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState({
//     tokenid: null,
//     username: '',
//     email: '',
//     usertype: '',
//     shopname: '',
//     mobilenumber: '',
//     closingbalance: '',
//     standingbalance: '',
//   });

//   // Load data from AsyncStorage on mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const keys = [
//           'tokenid',
//           'username',
//           'email',
//           'usertype',
//           'shopname',
//           'mobilenumber',
//           'closingbalance',
//           'standingbalance',
//         ];
//         const items = await AsyncStorage.multiGet(keys);
//         const storedData = {};
//         items.forEach(([key, value]) => {
//           storedData[key] = value;
//         });
//         setUserData(prevData => ({ ...prevData, ...storedData }));
//       } catch (error) {
//         console.error('Error loading user data:', error);
//       }
//     };
//     loadData();
//   }, []);

//   // Save or update specific user data fields
//   const saveUserData = async (newData = {}) => {
//     try {
//       // Only use the defined keys
//       const keys = [
//         'tokenid',
//         'username',
//         'email',
//         'usertype',
//         'shopname',
//         'mobilenumber',
//         'closingbalance',
//         'standingbalance',
//       ];
//       const updatedData = { ...userData, ...newData };
//       const entries = keys.map(key => [key, updatedData[key]?.toString() || '']);
//       await AsyncStorage.multiSet(entries);
//       setUserData(updatedData);
//     } catch (err) {
//       console.error('Error saving user data:', err);
//     }
//   };

//   // Clear all user data
//   const clearUserData = async () => {
//     try {
//       await AsyncStorage.clear();
//       setUserData({
//         tokenid: null,
//         username: '',
//         email: '',
//         usertype: '',
//         shopname: '',
//         mobilenumber: '',
//         closingbalance: '',
//         standingbalance: '',
//       });
//     } catch (err) {
//       console.error('Error clearing user data:', err);
//     }
//   };

//   return (
//     <UserContext.Provider value={{ userData, saveUserData, clearUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
