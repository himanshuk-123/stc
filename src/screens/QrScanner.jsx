// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   Image,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import { CameraKitCameraScreen } from 'react-native-camera-kit';
// import { launchImageLibrary } from 'react-native-image-picker';
// import jsQR from 'jsqr';
// import { Buffer } from 'buffer';

// global.Buffer = global.Buffer || Buffer;

// const QrScanner = () => {
//   const [scannedData, setScannedData] = useState('');
//   const [flashOn, setFlashOn] = useState(false);

//   const onQrCodeScan = (event) => {
//     const { nativeEvent } = event;
//     if (nativeEvent?.codeStringValue) {
//       setScannedData(nativeEvent.codeStringValue);
//       Alert.alert('QR Code Scanned', nativeEvent.codeStringValue);
//     }
//   };

//   const handleGalleryPick = async () => {
//     const result = await launchImageLibrary({
//       mediaType: 'photo',
//       includeBase64: true,
//     });

//     if (result?.assets && result.assets.length > 0) {
//       const image = result.assets[0];
//       const base64 = image.base64;

//       if (base64 && image.width && image.height) {
//         try {
//           const rawData = Buffer.from(base64, 'base64');
//           const imageData = new Uint8ClampedArray(rawData);
//           const resultQR = jsQR(imageData, image.width, image.height);
//           if (resultQR) {
//             setScannedData(resultQR.data);
//             Alert.alert('QR from Image', resultQR.data);
//           } else {
//             Alert.alert('No QR Found', 'Please try a clearer image');
//           }
//         } catch (error) {
//           Alert.alert('Error', 'Failed to process image');
//         }
//       } else {
//         Alert.alert('Error', 'Invalid image selected');
//       }
//     }
//   };

//   const requestGalleryPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         Alert.alert('Permission Denied', 'Cannot access gallery');
//       }
//     }
//     handleGalleryPick();
//   };

//   const toggleFlash = () => setFlashOn((prev) => !prev);

//   return (
//     <View style={{ flex: 1 }}>
//       <CameraKitCameraScreen
//         showFrame={true}
//         scanBarcode={true}
//         laserColor="blue"
//         frameColor="yellow"
//         colorForScannerFrame="black"
//         onReadCode={onQrCodeScan}
//         flashMode={flashOn ? 'on' : 'off'}
//       />

//       {scannedData ? (
//         <View style={styles.resultBox}>
//           <Text style={styles.resultText}>Scanned: {scannedData}</Text>
//         </View>
//       ) : null}

//       <View style={styles.bottomBar}>
//         <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
//           <Image
//             source={
//               flashOn
//                 ? require('../../assets/logo.png')
//                 : require('../../assets/logo.png')
//             }
//             style={styles.icon}
//           />
//           <Text style={styles.iconLabel}>{flashOn ? 'Flash On' : 'Flash Off'}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={requestGalleryPermission} style={styles.iconButton}>
//           <Image
//             source={require('../../assets/logo.png')}
//             style={styles.icon}
//           />
//           <Text style={styles.iconLabel}>Gallery</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default QrScanner;

// const styles = StyleSheet.create({
//   resultBox: {
//     padding: 16,
//     backgroundColor: '#fff',
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
//     borderRadius: 10,
//     elevation: 4,
//   },
//   resultText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   iconButton: {
//     alignItems: 'center',
//   },
//   icon: {
//     width: 32,
//     height: 32,
//     tintColor: '#000',
//   },
//   iconLabel: {
//     marginTop: 4,
//     fontSize: 12,
//     color: '#333',
//   },
// });
import { View, Text } from 'react-native'
import React from 'react'

const QrScanner = () => {
  return (
    <View>
      <Text>QrScanner</Text>
    </View>
  )
}

export default QrScanner