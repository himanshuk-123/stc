import { View, Text, SafeAreaView, FlatList, Image, Dimensions, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
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
import { useNavigation } from '@react-navigation/native';
const services = [
    // { id: '1', name: 'Standing Report', image: require('../../assets/logo.png'),navigate:'StandingReportScreen' },
    { id: '8', name: 'Recharge Report', image: require('../../assets/mobile_recharge.png'),navigate:'RechargeReport' },
    { id: '3', name: 'All Transaction Report', image: require('../../assets/transactionReport.png'),navigate:'TransactionReport'},
    { id: '2', name: 'Complain List', image: require('../../assets/complainlist.png'),navigate:'ComplainList' },
    { id: '4', name: 'User Day Book', image: require('../../assets/userDayBook.webp'),navigate:'UserDayBook'},
    { id: '5', name: 'Fund Request List', image: require('../../assets/fundRequestList.png'),navigate:'FundRequestList'},
    { id: '6', name: 'Member List', image: require('../../assets/memberList.png'),navigate:'MemberList' },
    { id: '7', name: 'Reports List', image: require('../../assets/reports_icon.png'),navigate:'ReportsList' },
    { id: '7', name: 'Standing Report', image: require('../../assets/loan.webp'),navigate:'StandingReport' },
]

const ReportsScreen = () => {
    const userData = useSelector(state => state.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    // Calculate responsive dimensions
    const cardWidth = "90%"; // For 3 cards per row
    const cardHeight = verticalScale(80);

    const filteredServices = services.filter(item =>
        item.name === 'Member List' ? userData.usertype === 'Distributer' : true
      );
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

            }}>
                <Header headingTitle="Balance & Reports" />
                <View style={{flex:1, justifyContent:'space-between',alignItems:'center'}}>
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
                    }}>₹ {userData.closingbalance ? parseFloat(userData.closingbalance) : '0.00'}</Text>
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
                    data={filteredServices}
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
                </View>
            </SafeAreaView>
            </ScrollView>
        </GradientLayout>
    )
}

export default ReportsScreen