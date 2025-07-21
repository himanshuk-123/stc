import React from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Cards from '../component/cards';
import BackArrowButton from '../component/BackArrowButton';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import CustomButton from '../component/button';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  
  // Calculate card dimensions for 3 cards per row
  const cardWidth = "90%"; // Using percentage for responsive width
  const cardHeight = verticalScale(70); // Height scales with screen size

  const renderItem = ({ item }) => (
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
        gradientColors={['#ffffff','#ffffff']}
        style={{ fontSize: moderateScale(13) }}
        cardsPerRow={3}
      />
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView style={{ 
        paddingHorizontal: horizontalScale(16), 
        paddingTop: verticalScale(16)
      }}>
        {/* Back Button and Title */}
        <Header headingTitle={"Bill Payments"} />
        
        {/* Search Bar */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 999,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: horizontalScale(16),
          marginBottom: verticalScale(16),
          height: verticalScale(40)
        }}>
          <TextInput
            placeholder="Search"
            style={{
              flex: 1,
              paddingVertical: verticalScale(8),
              color: '#333',
              fontWeight: 'bold',
              fontSize: moderateScale(16)
            }}
            placeholderTextColor="#888"
          />
        </View>

        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: verticalScale(16) }}
        />
        
        <View style={{ paddingBottom: verticalScale(20) }}>
          <CustomButton 
            title="Change Password" 
            onPress={() => navigation.navigate('ChangePassword')} 
          />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default ServicesScreen;
