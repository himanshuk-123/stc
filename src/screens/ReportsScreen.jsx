import { View, Text, SafeAreaView, FlatList, Image, Dimensions, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import Header from '../component/Header'
import CustomButton from '../component/button'
import Cards from '../component/cards'
import live_chat from '../../assets/live_chat.png'
import talk_to_us from '../../assets/talk_to_us.png'
import logo from '../../assets/logo.png'
import GradientLayout from '../component/GradientLayout'
import { useDispatch, useSelector } from 'react-redux';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { dashboardHome } from '../component/Commonfunction';
import { saveUserData } from '../redux/slices/userSlice'
const services = [
    // { id: '1', name: 'Standing Report', image: require('../../assets/logo.png'),navigate:'StandingReportScreen' },
    { id: '2', name: 'Complain List', image: require('../../assets/live_chat.png'),navigate:'ComplainList' },
    { id: '3', name: 'All Transaction Report', image: require('../../assets/talk_to_us.png'),navigate:'TransactionReport'},
    { id: '4', name: 'User Day Book', image: require('../../assets/logo.png'),navigate:'UserDayBook'},
    { id: '5', name: 'Fund Request List', image: require('../../assets/logo.png'),navigate:'FundRequestList'},
    { id: '6', name: 'Member List', image: require('../../assets/live_chat.png'),navigate:'MemberList' },
    { id: '7', name: 'Reports List', image: require('../../assets/live_chat.png'),navigate:'ReportsList' },
]

const ReportsScreen = () => {
    const userData = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    // Calculate responsive dimensions
    const cardWidth = "90%"; // For 3 cards per row
    const cardHeight = verticalScale(80);

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
                gradientColors={['#ffffff', '#ffffff']}
                style={{ fontSize: moderateScale(12) }}
                navigateTo={item.navigate}
                cardsPerRow={3}
            />
        </View>
    );
    
    const refreshBalance = async () => {
        setLoading(true);
        setRefreshing(true);
        try{
            const result = await dashboardHome({ userData });
            if (result.success) {
                dispatch(saveUserData({ closingbalance: result.data.closingBalance }));
            }
        }catch(error){
            console.error('Dashboard data fetch error:', error);
        }finally{
            setLoading(false);
            setRefreshing(false);
        }
    }
    if(loading){
        return <ActivityIndicator size="large" color="#0000ff" style={{flex:1, justifyContent:'center', alignItems:'center'}} />
    }
    return (
        <GradientLayout>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshBalance} />}>
            <SafeAreaView style={{
                        flex: 1,
                        paddingHorizontal: horizontalScale(16),
                        paddingTop: verticalScale(16),
                        justifyContent: 'space-between',
                        alignItems: 'center',

            }}>
                <Header headingTitle="Balance & Reports" />
                <View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: verticalScale(16)
                }}>
                    <Text style={{
                        fontSize: moderateScale(20),
                        fontWeight: 'bold',
                        color: 'black',
                        paddingLeft: horizontalScale(5)
                    }}>Available Balance</Text>
                    <Text style={{
                        fontSize: moderateScale(28),
                        color: 'black',
                        fontWeight: 'bold',
                        paddingLeft: horizontalScale(5)
                    }}>₹ {userData.closingbalance}</Text>
                </View>
                
                <View style={{
                    marginTop: verticalScale(16),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: verticalScale(16)
                }}>
                    <CustomButton
                        title='Refresh Your Balance'
                        width='70%'
                        onPress={refreshBalance}
                    />
                </View>
                
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={3}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: verticalScale(16)
                    }}
                />
</View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    width: '100%',
                    marginBottom: verticalScale(12)
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

                    {/* Logo */}
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
            </SafeAreaView>
            </ScrollView>
        </GradientLayout>
    )
}

export default ReportsScreen