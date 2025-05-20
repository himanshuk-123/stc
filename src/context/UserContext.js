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

//   useEffect(() => {
//     const loadData = async () => {
//       const tokenid = await AsyncStorage.getItem('token');
//       const username = await AsyncStorage.getItem('username');
//       const email = await AsyncStorage.getItem('email');
//       const usertype = await AsyncStorage.getItem('usertype');
//       const shopname = await AsyncStorage.getItem('shopname');
//       const mobilenumber = await AsyncStorage.getItem('mobilenumber');
//       const closingbalance = await AsyncStorage.getItem('closingbalance');
//       const standingbalance = await AsyncStorage.getItem('standingbalance');

//       if (tokenid) {
//         setUserData({ tokenid, username, email, usertype, shopname,mobilenumber,closingbalance, standingbalance});
//       }
//     };

//     loadData();
//   }, []);

  
//   const saveUserData = async (data) => {
//     const { tokenid, username, email, usertype, shopname,mobilenumber,closingbalance,standingbalance } = data;

//     await AsyncStorage.setItem('token', tokenid);
//     await AsyncStorage.setItem('username', username || '');
//     await AsyncStorage.setItem('email', email || '');
//     await AsyncStorage.setItem('usertype', usertype || '');
//     await AsyncStorage.setItem('shopname', shopname || '');
//     await AsyncStorage.setItem('mobilenumber', mobilenumber || '');
//     await AsyncStorage.setItem('closingbalance', closingbalance || '');
//     await AsyncStorage.setItem('standingbalance', standingbalance || '');

//     setUserData({ tokenid, username, email, usertype, shopname,mobilenumber ,closingbalance,standingbalance});
//   };

//   const clearUserData = async () => {
//     await AsyncStorage.clear();
//     setUserData({
//       tokenid: null,
//       username: '',
//       email: '',
//       usertype: '',
//       shopname: '',
//       mobilenumber: '',
//       closingbalance: '',
//       standingbalance: ''
//     });
//   };

//   return (
//     <UserContext.Provider value={{ userData, saveUserData, clearUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// context/UserContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    tokenid: null,
    username: '',
    email: '',
    usertype: '',
    shopname: '',
    mobilenumber: '',
    closingbalance: '',
    standingbalance: '',
  });

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = [
          'tokenid',
          'username',
          'email',
          'usertype',
          'shopname',
          'mobilenumber',
          'closingbalance',
          'standingbalance',
        ];
        const items = await AsyncStorage.multiGet(keys);
        const storedData = {};
        items.forEach(([key, value]) => {
          storedData[key] = value;
        });
        setUserData(prevData => ({ ...prevData, ...storedData }));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadData();
  }, []);

  // Save or update specific user data fields
  const saveUserData = async (newData = {}) => {
    try {
      // Only use the defined keys
      const keys = [
        'tokenid',
        'username',
        'email',
        'usertype',
        'shopname',
        'mobilenumber',
        'closingbalance',
        'standingbalance',
      ];
      const updatedData = { ...userData, ...newData };
      const entries = keys.map(key => [key, updatedData[key]?.toString() || '']);
      await AsyncStorage.multiSet(entries);
      setUserData(updatedData);
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  };

  // Clear all user data
  const clearUserData = async () => {
    try {
      await AsyncStorage.clear();
      setUserData({
        tokenid: null,
        username: '',
        email: '',
        usertype: '',
        shopname: '',
        mobilenumber: '',
        closingbalance: '',
        standingbalance: '',
      });
    } catch (err) {
      console.error('Error clearing user data:', err);
    }
  };

  return (
    <UserContext.Provider value={{ userData, saveUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};
