import { View, Text, SafeAreaView, FlatList, Modal, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RechargeApiServices from '../services/RechargeService';
import Constants from 'expo-constants';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../utils/authUtils';
const ComissionScreen = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const [commissionList, setCommissionList] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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

                console.log("API Response: ", data);
                if(data.STATUSCODE !== '1'){
                    setShowErrorModal(true);
                    setErrorMessage("Authentication failed");
                }
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

    const handleErrorModalOk = () => {
        setShowErrorModal(false);
        // Use the global logout function
        logout();
      };
    return (
        <GradientLayout>
            <SafeAreaView className="p-4 flex-1">
            <Modal
          visible={showErrorModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleErrorModalOk}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-xl w-4/5 items-center">
              <Text className="text-xl font-bold mb-4">Alert</Text>
              <Text className="text-gray-800 text-center mb-6">{errorMessage}</Text>
              <TouchableOpacity
                className="bg-blue-500 py-3 px-12 rounded-full"
                onPress={handleErrorModalOk}
              >
                <Text className="text-white font-bold text-lg">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
