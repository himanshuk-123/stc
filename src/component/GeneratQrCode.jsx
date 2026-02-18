import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { horizontalScale } from '../utils/responsive';
import GradientLayout from './GradientLayout';
import Header from './Header';

const screenWidth = Dimensions.get('window').width;

const GeneratQrCode = ({ mobileNumber, userName}) => {
  const viewShotRef = useRef();
  const appLogo = require('../../assets/logo.png'); 

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      await Share.open({
        url: uri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error) {
      console.error('QR share error:', error);
    }
  };

  return (
    <GradientLayout>
      <View style={{paddingHorizontal:16, paddingTop:16}}>
      <Header headingTitle="My QR Code" screenName="Profile" />
      </View>
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <View style={styles.qrWrapper}>
          {/* App name and logo */}
          <View style={styles.header}>
            <Image source={appLogo} style={styles.logo} />
          </View>

          {/* Tagline section */}
          <Text style={styles.accepted}>Accepted Here</Text>
          <Text style={styles.scanNote}>Scan and pay using STC App</Text>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <QRCode
              value={String(mobileNumber)}
              size={150}
              logoBackgroundColor="transparent"
            />
          </View>

          {/* Owner Name */}
          <Text style={styles.ownerName}>{userName}</Text>
        </View>
      </ViewShot>

      <View style={{ marginTop: 20 }}>
        <Button title='Share Qr Code'  onPress={handleShare}/>
      </View>
    </View>
    </GradientLayout>
  );
};

export default GeneratQrCode;

const styles = StyleSheet.create({
  container: {
    justifyContent:'center',
    alignItems: 'center',
    marginTop: 30,
    padding: 16,
    flex: 1,
  },
  qrWrapper: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: screenWidth * 0.9,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: horizontalScale(70),
    height: 36,
    marginRight: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  accepted: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#10b981',
  },
  scanNote: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  ownerName: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
