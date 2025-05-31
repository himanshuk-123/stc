import React from 'react';
import { View, Text, FlatList, SafeAreaView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Cards from '../component/cards';
import logo from '../../assets/logo.png';
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import CustomButton from '../component/button';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';

const services = [
    { id: '1', name: 'Comissions', image: require('../../assets/logo.png'), navigate:'Comission'},
    { id: '2', name: 'Postpaid', image: require('../../assets/live_chat.png') },
    { id: '3', name: 'Electricity', image: require('../../assets/talk_to_us.png') },
    { id: '4', name: 'FASTag', image: require('../../assets/logo.png') },
    { id: '5', name: 'Credit Card Bill', image: require('../../assets/logo.png') },
    // Add rest of your services here...
];

const MoreScreen = () => {
    const navigation = useNavigation();
    
    // Calculate responsive dimensions
    const cardWidth = "90%";
    const cardHeight = verticalScale(80);

    const renderItem = ({ item }) => (
        <View style={{
            width: '50%', 
            alignItems: 'center',
            marginVertical: verticalScale(8)
        }}>
            <Cards 
                imageSource={item.image} 
                title={item.name} 
                height={cardHeight}
                width={cardWidth}
                imgheight={verticalScale(50)}
                imgwidth={horizontalScale(50)}
                gradientColors={['#ffffff', '#ffffff']} 
                navigateTo={item.navigate}
                cardsPerRow={2}
                style={{ fontSize: moderateScale(14) }}
            />
        </View>
    );

    return (
        <GradientLayout>
            <SafeAreaView style={{
                flex: 1,
                paddingHorizontal: horizontalScale(16),
                paddingTop: verticalScale(16)
            }}>
                {/* Back Button and Title */}
                <Header headingTitle={"More"}/>

                {/* Cards Grid */}
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    style={{ marginBottom: verticalScale(16) }}
                />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    width: '100%',
                    marginBottom: verticalScale(12),
                    paddingHorizontal: horizontalScale(8)
                }}>
                    {/* Left Part: Live Chat & Talk to Us */}
                    <View style={{
                        flexDirection: 'row',
                        width: '50%',
                        height: '100%',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={live_chat}
                                style={{
                                    width: horizontalScale(44),
                                    height: verticalScale(44),
                                    marginBottom: verticalScale(4)
                                }}
                            />
                            <Text style={{ fontSize: moderateScale(12) }}>Live Chat</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={talk_to_us}
                                style={{
                                    width: horizontalScale(44),
                                    height: verticalScale(40),
                                    marginBottom: verticalScale(4)
                                }}
                            />
                            <Text style={{ fontSize: moderateScale(12) }}>Talk to Us</Text>
                        </View>
                    </View>

                    {/* Right Part: Logo */}
                    <View style={{
                        width: '50%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Image
                            source={logo}
                            style={{
                                width: horizontalScale(90),
                                height: verticalScale(40),
                                resizeMode: 'contain'
                            }}
                        />
                    </View>
                </View>
                
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

export default MoreScreen;
