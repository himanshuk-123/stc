import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const GeneratQrCode = ({ mobileNumber }) => {
  return (
    <View style={{ alignItems: 'center', marginTop: 50 }}>
      <Text>Your Payment QR Code:</Text>
      <QRCode
        value={String(mobileNumber)}
        size={150}
      />
    </View>
  );
};

export default GeneratQrCode;
