import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React,{ useContext } from 'react'
import Header from '../component/Header'
import { Image } from 'react-native'
import Cards from '../component/cards'
import GradientLayout from '../component/GradientLayout'
import { UserContext } from '../context/UserContext'

const features = [
    // { id: '1', name: 'Update Your KYC', image: require('../../assets/logo.png') },
    // { id: '2', name: 'Manage Your Account', image: require('../../assets/logo.png') },
    // { id: '3', name: 'Transaction History', image: require('../../assets/logo.png') },
    // { id: '4', name: 'Settings', image: require('../../assets/logo.png') },
    { id: '5', name: 'Help & Support', image: require('../../assets/logo.png'), navigate: 'SupportScreen' },
    // { id: '6', name: 'Logout', image: require('../../assets/logo.png') },
    // { id: '7', name: 'Update Your KYC', image: require('../../assets/logo.png') },
    // { id: '8', name: 'Manage Your Account', image: require('../../assets/logo.png') },
    // { id: '9', name: 'Transaction History', image: require('../../assets/logo.png') },
    // { id: '10', name: 'Settings', image: require('../../assets/logo.png') },
    { id: '12', name: 'Contact Us', image: require('../../assets/logo.png'), navigate: 'ContactScreen' },
]
const ProfileScreen = () => {
  const { userData, clearUserData } = useContext(UserContext);

  const logout = () =>{
    clearUserData();
  }
    const renderItem = ({item}) =>(
        <View className="w-1/3 items-center my-2 ">
            <Cards
                imageSource={item.image}
                title={item.name}
                height={100}
                width={100}
                gradientColors={['#ffffff', '#ffffff']}
                style={{ fontSize: 12 }}
                navigateTo={item.navigate}
            />
        </View>
    )
    return (
        <GradientLayout>
        <SafeAreaView className="px-4 pt-4">
            <Header />
            <View className="flex-row justify-center items-center ">
                <View className="w-28 h-28 rounded-full overflow-hidden bg-white shadow-md flex-row justify-center items-center">
                    <Image
                        source={require('../../assets/logo.png')}
                        resizeMode="cover"
                        style={{ width: '100%', height: '50%' }}
                    />
                </View>
            </View>

            <View className="flex justify-center items-center mt-6">
                <Text className="text-lg font-bold text-black">{userData.shopname}</Text>
                <Text className=" font-bold text-black" style={{ fontSize: 15 }}>{userData.email}</Text>
            </View>

            <FlatList
                data={features}
                keyExtractor={(item)=> item.id}
                renderItem={renderItem}
                numColumns={3}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
        </GradientLayout>
    )
}

export default ProfileScreen