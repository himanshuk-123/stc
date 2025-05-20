import { View, Text } from 'react-native'
import React from 'react'
import BackArrowButton from './BackArrowButton'
const Header = ({headingTitle}) => {
  return (
    <View>
       <View className="flex-row items-center mb-4 ">
          <BackArrowButton />
          <Text className="text-2xl font-bold text-black pl-5">{headingTitle}</Text>
        </View>
    </View>
  )
}

export default Header