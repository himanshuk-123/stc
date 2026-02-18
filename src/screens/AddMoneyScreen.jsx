import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import Header from '../component/Header';
import Cards from '../component/cards';
import Upi_icon from '../../assets/payUpi.png';
import add_money from '../../assets/add_money.png';
import GradientLayout from '../component/GradientLayout';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import scanner from '../../assets/scanner.png';
import paymentRequest from '../../assets/requestMoney.webp';
const AddMoneyScreen = () => {
  const navigation = useNavigation();
  const cardHeight = verticalScale(90);
  const cardWidth = '48%';

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <Header headingTitle="Add Money" />
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: verticalScale(130),
              // marginBottom: verticalScale(15),
            }}
          >
            <Cards
              imageSource={Upi_icon}
              title="PayU"
              gradientColors={['#ffffff', '#ffffff']}
              height={cardHeight}
              width={cardWidth}
              imgheight={verticalScale(30)}
              imgwidth={horizontalScale(70)}
              onPress={() => navigation.navigate('PayU')}
              style={{ fontSize: moderateScale(13) }}
            />
            <Cards
              showIcon={true}
              imageSource={scanner}
              title="Scan & Pay"
              gradientColors={['#ffffff', '#ffffff']}
              height={cardHeight}
              width={cardWidth}
              imgheight={verticalScale(30)}
              imgwidth={horizontalScale(70)}
              onPress={() => navigation.navigate('QrScanner')}
              style={{ fontSize: moderateScale(13) }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // height: verticalScale(140),
              // marginBottom: verticalScale(15),
            }}
          >
            <Cards
              imageSource={add_money}
              title="Wallet to Wallet"
              gradientColors={['#ffffff', '#ffffff']}
              height={cardHeight}
              width={cardWidth}
              imgheight={verticalScale(30)}
              imgwidth={horizontalScale(70)}
              onPress={() =>
                navigation.navigate('WalletPayment', { scannedNumber: null })
              }
              style={{ fontSize: moderateScale(13) }}
            />
            <Cards
              imageSource={paymentRequest}
              title="Payment Request"
              gradientColors={['#ffffff', '#ffffff']}
              height={cardHeight}
              width={cardWidth}
              imgheight={verticalScale(30)}
              imgwidth={horizontalScale(70)}
              onPress={() => navigation.navigate('PaymentRequest')}
              style={{ fontSize: moderateScale(13) }}
            />
          </View>
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default AddMoneyScreen;
