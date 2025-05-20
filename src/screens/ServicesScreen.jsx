import React from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import Cards from '../component/cards';
import BackArrowButton from '../component/BackArrowButton';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import CustomButton from '../component/button';

const services = [
  { id: '1', name: 'Credit Card Bill', image: require('../../assets/logo.png') },
  { id: '2', name: 'Postpaid', image: require('../../assets/live_chat.png') },
  { id: '3', name: 'Electricity', image: require('../../assets/talk_to_us.png') },
  { id: '4', name: 'FASTag', image: require('../../assets/logo.png') },
  { id: '5', name: 'Credit Card Bill', image: require('../../assets/logo.png') },
  { id: '6', name: 'Postpaid', image: require('../../assets/live_chat.png') },
  { id: '7', name: 'Electricity', image: require('../../assets/talk_to_us.png') },
  { id: '8', name: 'FASTag', image: require('../../assets/logo.png') },
  { id: '9', name: 'Credit Card Bill', image: require('../../assets/logo.png') },
  { id: '10', name: 'Postpaid', image: require('../../assets/live_chat.png') },
  { id: '11', name: 'Electricity', image: require('../../assets/talk_to_us.png') },
  { id: '12', name: 'FASTag', image: require('../../assets/logo.png') },
  { id: '13', name: 'Credit Card Bill', image: require('../../assets/logo.png') },
  { id: '14', name: 'Postpaid', image: require('../../assets/live_chat.png') },
  { id: '15', name: 'Electricity', image: require('../../assets/talk_to_us.png') },
  { id: '16', name: 'FASTag', image: require('../../assets/logo.png') },
  // Add rest of your services here...
];

const ServicesScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View className="w-1/3 items-center my-2">
      <Cards 
      imageSource={item.image}
       title={item.name}
        height={100}
         width={100}
          gradientColors={['#ffffff','#ffffff']}
          style={{fontSize:12}} />
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView className="px-4 pt-4">
        {/* Back Button and Title */}
       <Header headingTitle={"Bill Payments"} />
        {/* Search Bar */}
        <View className="bg-white rounded-full flex-row items-center px-4 mb-4"
            style={{height: 50}}
        >
          <TextInput
            placeholder="Search"
            className="flex-1 py-2 text-gray-700 font-bold text-lg"
            placeholderTextColor="#888"
          />
          <Ionicons name="search" size={28} color="#666" />
        </View>

        {/* Cards Grid */}
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
        />
      <CustomButton title="Change Password" onPress={() => navigation.navigate('ChangePasswordScreen')} />
      </SafeAreaView>
      </GradientLayout>
  );
};

export default ServicesScreen;
