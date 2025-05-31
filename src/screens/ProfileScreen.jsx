import { View, Text, SafeAreaView, FlatList, Alert, ScrollView } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../component/Header'
import { Image } from 'react-native'
import Cards from '../component/cards'
import GradientLayout from '../component/GradientLayout'
import { useNavigation } from '@react-navigation/native'
import { logout } from '../utils/authUtils'
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import GeneratQrCode from '../component/GeneratQrCode';
const features = [
    // { id: '1', name: 'Update Your KYC', image: require('../../assets/logo.png') },
    // { id: '2', name: 'Manage Your Account', image: require('../../assets/logo.png') },
    // { id: '3', name: 'Transaction History', image: require('../../assets/logo.png') },
    // { id: '4', name: 'Settings', image: require('../../assets/logo.png') },
    { id: '5', name: 'Help & Support', image: require('../../assets/logo.png'), navigate: 'Support' },
    { id: '6', name: 'Logout', image: require('../../assets/logo.png'), navigate: 'Logout' },
    // { id: '7', name: 'Update Your KYC', image: require('../../assets/logo.png') },
    // { id: '8', name: 'Manage Your Account', image: require('../../assets/logo.png') },
    // { id: '9', name: 'Transaction History', image: require('../../assets/logo.png') },
    // { id: '10', name: 'Settings', image: require('../../assets/logo.png') },
    { id: '12', name: 'Contact Us', image: require('../../assets/logo.png'), navigate: 'Contact' },
]

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  // Redux hooks instead of Context
  const userData = useSelector((state) => state.user);
  const cardWidth = "93%"; // For 3 cards per row
  const cardHeight = verticalScale(70);
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => logout(navigation)
        }
      ]
    );
  }
  
  const renderItem = ({item}) =>(
    <View style={{
        width: '33%',
        alignItems: 'center',
        marginVertical: verticalScale(8)
      }}>
        <Cards
            imageSource={item.image}
            title={item.name}
            height={cardHeight}
            width={cardWidth}
            imgheight={verticalScale(40)}
            imgwidth={horizontalScale(40)}
            gradientColors={['#ffffff', '#ffffff']}
            style={{ fontSize: moderateScale(13) }}
            navigateTo={item.navigate !== 'Logout' ? item.navigate : null}
            onPress={item.navigate === 'Logout' ? handleLogout : () => navigation.navigate(item.navigate)}
        />
    </View>
  )
  return (
    <GradientLayout>
    <SafeAreaView style={{
        paddingHorizontal: horizontalScale(16),
        paddingTop: verticalScale(16)
      }}>
        <ScrollView style={{marginBottom:verticalScale(10)}}>
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
            <Text className="text-lg font-bold text-black" style={{ fontSize: moderateScale(17) }}>{userData.shopname}</Text>
            <Text className=" font-bold text-black" style={{ fontSize: moderateScale(16) }}>{userData.email}</Text>
        </View>
        <View className="flex justify-center items-center mt-6">
          <GeneratQrCode mobileNumber={userData.mobilenumber} />
        </View>
        <FlatList
            data={features}
            keyExtractor={(item)=> item.id}
            renderItem={renderItem}
            numColumns={3}  
            showsVerticalScrollIndicator={false}
             scrollEnabled={false}
        />
        </ScrollView>
    </SafeAreaView>
    </GradientLayout>
  )
}

export default ProfileScreen