import React from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import Cards from '../component/cards';
import BackArrowButton from '../component/BackArrowButton';
import logo from '../../assets/logo.png';
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import CustomButton from '../component/button';

const services = [
    { id: '1', name: 'Comissions', image: require('../../assets/logo.png'),navigate:'ComissionScreen'},
    { id: '2', name: 'Postpaid', image: require('../../assets/live_chat.png') },
    { id: '3', name: 'Electricity', image: require('../../assets/talk_to_us.png') },
    { id: '4', name: 'FASTag', image: require('../../assets/logo.png') },
    { id: '5', name: 'Credit Card Bill', image: require('../../assets/logo.png') },
    // Add rest of your services here...
];

const MoreScreen = () => {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <View className="w-1/2 items-center my-2 ">
            <Cards 
            imageSource={item.image} 
            title={item.name} 
            height={100} 
            width={150} 
            gradientColors={['#ffffff', '#ffffff']} 
            navigateTo={item.navigate}
            />
        </View>
    );

    return (

        <GradientLayout>
            <SafeAreaView className="flex-1 px-4 pt-4">
                {/* Back Button and Title */}
                <Header headingTitle={"More"}/>

                {/* Cards Grid */}
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={2}
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
                <CustomButton title="Change Password" onPress={() => navigation.navigate('ChangePasswordScreen')} />

            </SafeAreaView>
            </GradientLayout>
    );
};

export default MoreScreen;
