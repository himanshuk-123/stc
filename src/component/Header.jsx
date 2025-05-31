import { View, Text } from 'react-native'
import React from 'react'
import BackArrowButton from './BackArrowButton'
import { moderateScale } from '../utils/responsive'
const Header = ({headingTitle, screenName = null}) => {
  return (
    <View>
       <View className="flex-row items-center mb-4 ">
          <BackArrowButton screenName={screenName} />
          <Text className="text-2xl font-bold text-black pl-5" style={{ fontSize: moderateScale(20) }}>{headingTitle}</Text>
        </View>
    </View>
  )
}

export default Header