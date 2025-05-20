import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../component/Header'
import GradientLayout from '../component/GradientLayout'

const NotificationScreen = () => {
  return (
    <GradientLayout>
    <SafeAreaView className="flex-1 px-4 ">
        <View className="flex-row justify-between items-center m-2">
        <Header headingTitle="Notifications"/>
        <Text className="text-lg font-bold text-black ">Clear All</Text>
        </View>
    </SafeAreaView>
    </GradientLayout>
  )
}

export default NotificationScreen