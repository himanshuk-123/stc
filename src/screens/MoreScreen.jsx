import React from 'react';
import { View, Text, FlatList, SafeAreaView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Cards from '../component/cards';
import logo from '../../assets/logo.png';
import live_chat from '../../assets/live_chat.png';
import talk_to_us from '../../assets/talk_to_us.png';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import CustomButton from '../component/button';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { handleCallPress } from '../component/Commonfunction';

const services = [
    { id: '1', name: 'Comissions', image: require('../../assets/commimg.png'), navigate: 'Comission' },
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
                <Header headingTitle={"More"} />

                {/* Cards Grid */}
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View>
                        <FlatList
                            data={services}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            style={{ marginBottom: verticalScale(16) }}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        width: '100%',
                        marginBottom: verticalScale(12),
                        paddingHorizontal: horizontalScale(8),
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
                                <Text style={{ fontSize: moderateScale(12), color: 'black' }}>Live Chat</Text>
                            </View>
                            <TouchableOpacity onPress={handleCallPress}>
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={talk_to_us}
                                    style={{
                                        width: horizontalScale(44),
                                        height: verticalScale(40),
                                        marginBottom: verticalScale(4)
                                    }}
                                />
                                <Text style={{ fontSize: moderateScale(12), color: 'black' }}>Talk to Us</Text>
                            </View>
                            </TouchableOpacity>
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
                </View>
            </SafeAreaView>
        </GradientLayout>
    );
};

export default MoreScreen;
