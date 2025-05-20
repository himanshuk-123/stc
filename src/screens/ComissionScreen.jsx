import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RechargeApiServices from '../services/RechargeService';
import Constants from 'expo-constants';
import { UserContext } from '../context/UserContext';

const ComissionScreen = () => {
    const {userData } = useContext(UserContext)
    const [commissionList, setCommissionList] = useState([]);

    useEffect(() => {
        const fetchCommission = async () => {
            try {
                const token = userData.tokenid;
                const payload = {
                    Tokenid: token,
                    Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
                    Location: null,
                };

                const response = await RechargeApiServices.commission(
                    payload.Tokenid,
                    payload.Version,
                    payload.Location
                );
                const data = response.data;

                if (data.ERROR === '0') {
                    const formattedList = data.Commissionlist.map((item, index) => ({
                        id: index.toString(), // fix: unique id
                        Name: item.Name,
                        OperatorType: item.OperatorType,
                        margintype: item.margintype,
                        CommissionMode: item.CommissionMode,
                        CommAmt: item.CommAmt,
                    }));
                    setCommissionList(formattedList);
                } else {
                    console.log('API Error:', data.MESSAGE);
                }
            } catch (error) {
                console.log("Fetch Commission Error:", error);
            }
        };

        fetchCommission();
    }, []);

    const renderItem = ({ item }) => (
        <View className="bg-white rounded-lg p-4 mb-2 shadow-sm border border-gray-200">
            <Text className="text-base font-bold text-gray-800 mb-1">Name: {item.Name}</Text>
            <Text className="text-sm text-gray-700">Operator Type: {item.OperatorType}</Text>
            <Text className="text-sm text-gray-700">Commission: {item.CommAmt}%</Text>
            <Text className="text-sm text-gray-700">Margin Type: {item.margintype}</Text>
        </View>
    );

    return (
        <GradientLayout>
            <SafeAreaView className="p-4 flex-1">
                <Header headingTitle="Your Commission" />
                <View className="flex-row justify-between border-y border-gray-300 py-2 mb-2">
                    <Text className="font-semibold text-gray-700">Provider</Text>
                    <Text className="font-semibold text-gray-700">% / ₹</Text>
                    <Text className="font-semibold text-gray-700">Type</Text>
                </View>
                <FlatList
                    data={commissionList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text className="text-center text-gray-500 mt-4">No commission data available</Text>}
                />
            </SafeAreaView>
        </GradientLayout>
    );
};

export default ComissionScreen;
