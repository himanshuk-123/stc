import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../component/Header'
import Cards from '../component/cards'
import Upi_icon from '../../assets/UPI_icon.png'
import GradientLayout from '../component/GradientLayout'
const AddMoneyScreen = () => {
  return (
    <GradientLayout>
    <SafeAreaView className="px-4 pt-4">
        <Header headingTitle="Add Money" />
        <Cards imageSource={Upi_icon} title="PayU" gradientColors={['#ffffff','#ffffff']} height={120} imgheight={80} imgwidth={80}/>
    </SafeAreaView>
    </GradientLayout>
  )
}

export default AddMoneyScreen