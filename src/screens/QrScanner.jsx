import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const QRScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  const validateMobileNumber = (number) => {
    // Remove any non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    
    // Check if it's a valid 10-digit Indian mobile number
    // Must start with 6, 7, 8, or 9 and be exactly 10 digits
    return /^[6789]\d{9}$/.test(cleanNumber);
  };

  const handleScanned = ({ type, data }) => {
    setScanned(true);
    
    // Clean the scanned data
    const cleanedNumber = data.replace(/\D/g, '');
    
    if (validateMobileNumber(cleanedNumber)) {
      // Navigate to MobileRecharge screen with the scanned number
      navigation.navigate('WalletPayment', { scannedNumber: cleanedNumber });
    } else {
      alert('Invalid QR Code: Please scan a valid mobile number QR code');
      // Reset scanned state to allow another scan
      setScanned(false);
    }
  };

  if (!permission) {
    return <Text style={styles.text}>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleScanned}
        style={styles.camera}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          Align QR code within the frame
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QRScanner;
