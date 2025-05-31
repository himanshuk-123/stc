import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../component/Header'
import Cards from '../component/cards'
import Upi_icon from '../../assets/UPI_icon.png'
import add_money from '../../assets/add_money.png'
import GradientLayout from '../component/GradientLayout'
import { horizontalScale, verticalScale } from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
const AddMoneyScreen = () => {
  const navigation = useNavigation();
  const cardHeight = verticalScale(120);
  const cardWidth = '48%';
  return (
    <GradientLayout>
    <SafeAreaView className="px-4 pt-4">
        <Header headingTitle="Add Money" />
        <View >
        <View>
        <Cards imageSource={Upi_icon} title="PayU" gradientColors={['#ffffff','#ffffff']} height={cardHeight} width={cardWidth} imgheight={verticalScale(70)} imgwidth={horizontalScale(70)}/>
        <Cards 
        imageSource={add_money} 
        title="Scan & Pay" 
        gradientColors={['#ffffff','#ffffff']}
        height={cardHeight} 
        width={cardWidth}
        imgheight={verticalScale(70)} 
        imgwidth={horizontalScale(70)}
        onPress={() => navigation.navigate('QrScanner')}
        />
        </View>
        <View>
        <Cards 
        imageSource={add_money} 
        title="Scan & Pay" 
        gradientColors={['#ffffff','#ffffff']}
        height={cardHeight} 
        width={cardWidth}
        imgheight={verticalScale(70)} 
        imgwidth={horizontalScale(70)}
        onPress={() => navigation.navigate('QrScanner')}
        />
        </View>
        </View>
    </SafeAreaView>
    </GradientLayout>
  )
}

export default AddMoneyScreen