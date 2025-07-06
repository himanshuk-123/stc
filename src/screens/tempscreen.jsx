// import React from 'react';
// import { Button, PermissionsAndroid, Platform, Alert } from 'react-native';
// import { selectContactPhone } from 'react-native-contact-picker';

// const requestContactsPermission = async () => {
//   if (Platform.OS === 'android') {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_CONTACTS
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   }
//   return true;
// };

// const ContactPicker = ({ setMobileNo }) => {
//   const handlePick = async () => {
//     const ok = await requestContactsPermission();
//     if (!ok) return;

//     try {
//       const contact = await selectContactPhone();

//       if (contact) {
//         let number = contact.phoneNumber.number;
//         let sanitized = number.replace(/\D/g, '');

//         if (sanitized.startsWith('91') && sanitized.length > 10) {
//           sanitized = sanitized.substring(2);
//         }

//         sanitized = sanitized.slice(-10);

//         if (/^[6789]\d{9}$/.test(sanitized)) {
//           setMobileNo(sanitized);
//         } else {
//           Alert.alert('Invalid Number', 'Please select a valid 10-digit Indian number.');
//         }
//       }
//     } catch (e) {
//       console.warn('Contact picking failed:', e);
//     }
//   };

//   return <Button title="Pick Contact" onPress={handlePick} />;
// };

// export default ContactPicker;
import { View, Text } from 'react-native'
import React from 'react'

const tempscreen = () => {
  return (
    <View>
      <Text>tempscreen</Text>
    </View>
  )
}

export default tempscreen