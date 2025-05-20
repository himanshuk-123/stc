import { View, Text, SafeAreaView, FlatList, Image } from 'react-native'
import React from 'react'
import Header from '../component/Header'
import CustomButton from '../component/button'
import Cards from '../component/cards'
import live_chat from '../../assets/live_chat.png'
import talk_to_us from '../../assets/talk_to_us.png'
import logo from '../../assets/logo.png'
import GradientLayout from '../component/GradientLayout'
const services = [
    { id: '1', name: 'Standing Report', image: require('../../assets/logo.png'),navigate:'StandingReportScreen' },
    { id: '2', name: 'Complain List', image: require('../../assets/live_chat.png'),navigate:'ComplainListScreen' },
    { id: '3', name: 'All Transaction Report', image: require('../../assets/talk_to_us.png'),navigate:'TransactionReportScreen'},
    { id: '4', name: 'User Day Book', image: require('../../assets/logo.png'),navigate:'UserDayBookScreen'},
    { id: '5', name: 'Fund Request List', image: require('../../assets/logo.png'),navigate:'FundRequestListScreen'},
    { id: '6', name: 'Member List', image: require('../../assets/live_chat.png'),navigate:'MemberListScreen' },
]

const ReportsScreen = () => {
    const renderItem = ({ item }) => (
        <View className="w-1/3 items-center my-2">
            <Cards 
            imageSource={item.image}
             title={item.name}
              height={100}
               width={100}
                gradientColors={['#ffffff', '#ffffff']}
                imgheight={40}
                imgwidth={40}
                style={{fontSize:12}}
                navigateTo={item.navigate} />
        </View>
    );
    return (
        <GradientLayout>
        <SafeAreaView className="px-4 pt-4 flex-1">
            <Header headingTitle="Balance & Reports" />
            <View className="justify-center items-center">
                <Text className="text-xl font-bold text-black pl-5">Available Balance</Text>
                <Text className="text-3xl  text-black font-bold pl-5">₹ 0.0</Text>
            </View>
            <View className="mt-4 justify-center items-center">
                <CustomButton
                    title='Refresh Your Balance'
                    height={50}
                    width='70%'
                />
            </View>
            <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={3}
                showsVerticalScrollIndicator={false}
            />

            <View className="flex-row justify-between items-end w-full mb-3">
                {/* Left Part: Live Chat & Talk to Us */}
                <View className="flex-row  w-1/2 h-full justify-around items-center">
                    <View className="items-center">
                        <Image source={live_chat} className="w-11 h-11 mb-1" />
                        <Text className="text-xs">Live Chat</Text>
                    </View>
                    <View className="items-center">
                        <Image source={talk_to_us} className="w-11 h-10 mb-1" />
                        <Text className="text-xs">Talk to Us</Text>
                    </View>
                </View>

                {/* Right Part: Curved half-circle with logo */}
                <View className="  w-1/2 items-center justify-center">
                    <Image
                        source={logo}
                        style={{
                            width: 90,
                            height: 40,
                            justifyContent: 'center',

                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
        </GradientLayout>
    )
}

export default ReportsScreen