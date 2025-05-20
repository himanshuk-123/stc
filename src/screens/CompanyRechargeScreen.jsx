import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Image, ScrollView, Alert } from 'react-native';
import Header from '../component/Header';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import GradientLayout from '../component/GradientLayout';
import CustomButton from '../component/button';
import RechargeService from '../services/RechargeService';
import Constants from 'expo-constants';
import { UserContext } from '../context/UserContext';

const CompanyRechargeScreen = ({route}) => {
    const { operator, mode,opcodenew } = route.params;
    const [MobileNo, setMobileNo] = useState('');
    const [Amount, setAmount] = useState('');
    const [Pin, setPin] = useState('');
    const [CircleId, setCircleId] = useState('');
    const [MediumId, setMediumId] = useState('');
    const [CircleCode, setCircleCode] = useState('');
    const [AccountNo, setAccountNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rechargeData, setRechargeData] = useState(null);
    const [showRechargeSuccess, setShowRechargeSuccess] = useState(false);
    const [showRechargeError, setShowRechargeError] = useState(false);
    const { userData } = useContext(UserContext);

    const handleRecharge = async () => {
        setLoading(true);
        setError(null);
        setRechargeData(null);
        setShowRechargeSuccess(false);
        setShowRechargeError(false);

        const payload = {
            Token: userData.tokenid,
            UserID: null,
            RefTxnId:null,
            MobileNo:MobileNo,
            Operator: opcodenew,
            CricleId:"12",
            Amount:Amount,
            Pin:"0000",
            CircleId:null,
            MediumId:"1",
            CircleCode:null,
            AccountNo:null,
            AccountOther:null,
            Version:Constants?.expoConfig?.version?.split('.')[0] || '1',
            Location:null,
        }
        try {
            const response = await RechargeService.RechargeCall(
               payload.Token,
               payload.UserID,
               payload.RefTxnId,
               payload.MobileNo,
               payload.Operator,
               payload.CricleId,
               payload.Amount,
               payload.Pin,
               payload.CircleId,
               payload.MediumId,
               payload.CircleCode,
               payload.AccountNo,
               payload.AccountOther,
               payload.Version,
               payload.Location,
            )
            console.log(response.data);
    }catch(error){
        console.error('Error during recharge:', error);
        setError('An error occurred while processing the recharge. Please try again.');
    }finally{
        setLoading(false);
    }
    }

    return (
        <GradientLayout>
            <SafeAreaView className="p-4 flex-1">
                <Header headingTitle={mode === "1" ? "Mobile Recharge" : "DTH Recharge"} />

                <ScrollView className="flex-1"
                showsVerticalScrollIndicator={false}
                >
                    {/* Operator image and name */}
                    <View className="items-center mb-2 ">
                        <Image
                            source={{ uri: operator.image }}
                            style={{ width: 100, height: 100,borderRadius:50}}
                            resizeMode="cover"
                        />
                        <Text className="text-lg font-bold mt-2">{operator.name}</Text>
                    </View>

                    {/* Mobile Number Input */}
                    <View className="bg-white rounded-full flex-row items-center px-6 mb-4 mt-5" style={{ height: 60 }}>
                        <FontAwesome name="mobile-phone" size={36} color="#03a5fc" />
                        <TextInput
                            placeholder="Mobile Number"
                            className="flex-1 py-2 text-gray-700 pl-6 font-bold text-2xl"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={MobileNo}
                            onChangeText={setMobileNo}
                        />
                        {
                            mode === "1" ?
                                <AntDesign name="contacts" size={32} color="#666" /> : ""
                        }
                    </View>

                    {/* Amount Input */}
                    <View className="bg-white rounded-full flex-row items-center px-6 mb-4" style={{ height: 60 }}>
                        <FontAwesome name="rupee" size={36} color="#f72343" />
                        <TextInput
                            placeholder="Amount"
                            className="flex-1 py-2 text-gray-700 pl-6 font-bold text-2xl"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={Amount}
                            onChangeText={setAmount}
                        />
                        <Image source={{ uri: operator.image }} style={{ width: 55, height: 35 }} resizeMode="contain" />
                    </View>

                    {/* Action Buttons */}
                    {
                        mode === "1" ?
                            <View className="flex-row justify-between mb-4">
                                <CustomButton width="150" height="50" title="Recharge"  />
                                <CustomButton width="150" height="50" title="Browse Plans" />
                            </View>
                            :
                            <View style={{ marginBottom: 16, gap: 10 }}>
                                <CustomButton title="Recharge" />
                                <CustomButton title="Customer Info" />
                                <CustomButton title="DTH Plan" />
                                <CustomButton title="Refresh DTH Service" />
                            </View>
                    }

                    <CustomButton title="Proceed" onPress={handleRecharge}/>

                    {/* Note */}
                    <View className="mt-4">
                        <Text className="text-gray-500 font-bold text-sm">
                            Note: Please verify {mode === "1" ? "recharge" : "DTH"} amount and benefits with your operator before proceeding. Plans have been shown basis latest available informatin and might not be accurate always. You can choose to DTH with any amount and benefit will be decided by your {mode === "1" ? "recharge" : "DTH"} operator.
                        </Text>

                    </View>
                    <Text>
                        {opcodenew}
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </GradientLayout>
    );
};

export default CompanyRechargeScreen;
