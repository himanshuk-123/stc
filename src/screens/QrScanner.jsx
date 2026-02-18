import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';
import galleryIcon from '../../assets/gallery.png'; // Replace with your path
import Header from '../component/Header';

const QRScannerScreen   = () => {
  const [scanned, setScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const navigation = useNavigation();

  const device = useCameraDevice('back', { resolution: '720p' });
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  useEffect(() => {
    const timer = setTimeout(() => setCameraReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => () => setIsCameraActive(false), []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsCameraActive(false);
    });
    return unsubscribe;
  }, [navigation]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (!scanned && codes.length > 0) {
        const qrData = codes[0]?.value;
        if (qrData) {
          setScanned(true);
          setIsCameraActive(false);
          navigation.navigate('WalletPayment', { scannedNumber: qrData });
        }
      }
    },
  });

  const handleGalleryScan = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async (response) => {
      if (response.didCancel || response.errorCode) {
        Alert.alert('Error', 'No image selected or error occurred');
        return;
      }

      const uri = response.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert('Error', 'Invalid image');
        return;
      }

      try {
        const { values } = await RNQRGenerator.detect({ uri });
        if (values && values.length > 0) {
          setScanned(true);
          setIsCameraActive(false);
          navigation.navigate('WalletPayment', { scannedNumber: values[0] });
        } else {
          Alert.alert('No QR Code', 'No QR code detected in the image');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to scan QR code from image');
      }
    });
  };

  if (!hasPermission || !device || !cameraReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCameraActive && (
        <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        codeScanner={codeScanner}
        enableFrameProcessor={false}
        />
      )}

      <View style={{padding:16, backgroundColor:'transparent', position:'absolute', top:0, left:0, right:0  }}>
      <Header headingTitle="Qr Scanner"/>
      </View>
      <View style={styles.overlay}>
        <Text style={styles.instruction}>Align QR Code within frame</Text>

        <TouchableOpacity onPress={handleGalleryScan} style={styles.galleryIconButton}>
          <Image source={galleryIcon} style={styles.galleryIcon} />
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => {
              setScanned(false);
              setIsCameraActive(true);
            }}
          >
            <Text style={styles.rescanText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instruction: {
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  galleryIconButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  galleryIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  rescanButton: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rescanText: {
    color: '#fff',
    fontWeight: 'bold',
    color: 'black'
  },
});

export default QRScannerScreen;
