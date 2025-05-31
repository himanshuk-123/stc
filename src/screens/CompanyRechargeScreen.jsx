import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, SafeAreaView, TextInput, Image, ScrollView, Alert, ActivityIndicator, FlatList, TouchableOpacity, Platform, Modal, StyleSheet } from 'react-native';
import Header from '../component/Header';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import GradientLayout from '../component/GradientLayout';
import CustomButton from '../component/button';
import RechargeService from '../services/RechargeService';
import Constants from 'expo-constants';
import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import { PlanService } from '../services/PlanService';
const CompanyRechargeScreen = ({ route }) => {
    const { operator, mode, opcodenew, number } = route.params;
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
    const [contacts, setContacts] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [showContactList, setShowContactList] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [customerInfo, setCustomerInfo] = useState(false);
    const [customerInfoData, setCustomerInfoData] = useState({
        DATA: {
            Address: "",
            Balance: "",
            District: "",
        }
    });
    const navigation = useNavigation();
    // Use Redux selector instead of Context
    const userData = useSelector(state => state.user);

    // Function to handle contact selection
    const openContacts = async () => {
        try {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });

                const filtered = data.filter(
                    c => c.phoneNumbers && c.phoneNumbers.length > 0
                );

                setContacts(filtered);
                setShowContactList(true);  // Show contact list
            } else {
                Alert.alert('Permission Denied', 'Enable contacts permission.', [
                    { text: 'OK' },
                    { text: 'Open Settings', onPress: openSettings },
                ]);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not access contacts.');
        }
    };



    // Function to open device settings (handle platform differences)
    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    const seeCustomerInfo = () => {
        setCustomerInfo(true);
        console.log("customerInfo", customerInfo);
    }

    // Function to process the selected contact and extract phone number
    const processSelectedContact = (contact) => {
        let mobileNumber = contact.phoneNumbers.find(
            p => p.label?.toLowerCase() === 'mobile'
        )?.number;

        if (!mobileNumber) {
            mobileNumber = contact.phoneNumbers[0]?.number;
        }

        if (mobileNumber) {
            const sanitized = sanitizePhoneNumber(mobileNumber);
            if (validateIndianMobileNumber(sanitized)) {
                setMobileNo(sanitized);
                setShowContactList(false);
            } else {
                Alert.alert('Invalid Number', 'Please pick a valid 10-digit Indian number.');
            }
        }
    };



    // Function to sanitize phone number
    const sanitizePhoneNumber = (number) => {
        // Remove all non-digit characters
        let sanitized = number.replace(/\D/g, '');

        // Remove +91 country code if present
        if (sanitized.startsWith('91') && sanitized.length > 10) {
            sanitized = sanitized.substring(2);
        }

        // Ensure it's at most 10 digits (truncate if longer)
        if (sanitized.length > 10) {
            sanitized = sanitized.substring(sanitized.length - 10);
        }

        return sanitized;
    };

    // Function to validate if it's a valid 10-digit Indian mobile number
    const validateIndianMobileNumber = (number) => {
        // Check if it's exactly 10 digits and starts with 6, 7, 8, or 9
        return /^[6789]\d{9}$/.test(number);
    };

    const showConfirmation = () => {
        // Validate inputs before showing confirmation
        if (!MobileNo || MobileNo.length !== 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
            return;
        }

        if (!Amount || isNaN(Amount) || parseFloat(Amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount.');
            return;
        }

        setShowConfirmationModal(true);
    };

    // const handleRecharge = async () => {
    //     setShowConfirmationModal(false);
    //     setLoading(true);
    //     setError(null);
    //     setRechargeData(null);
    //     setShowRechargeSuccess(false);
    //     setShowRechargeError(false);

    //     const payload = {
    //         Token: userData.tokenid,
    //         UserID: null,
    //         RefTxnId: null,
    //         MobileNo: MobileNo,
    //         Operator: opcodenew,
    //         CricleId: "12",
    //         Amount: Amount,
    //         Pin: "0000",
    //         CircleId: null,
    //         MediumId: "1",
    //         CircleCode: null,
    //         AccountNo: null,
    //         AccountOther: null,
    //         Optional1: null,
    //         Optional2: null,
    //         Optional3: null,
    //         Optional4: null,
    //         Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
    //         Location: null,
    //     }
    //     console.log(payload);
    //     try {
    //         const response = await RechargeService.RechargeCall(
    //             payload.Token,
    //             payload.UserID,
    //             payload.RefTxnId,
    //             payload.MobileNo,
    //             payload.Operator,
    //             payload.CricleId,
    //             payload.Amount,
    //             payload.Pin,
    //             payload.CircleId,
    //             payload.MediumId,
    //             payload.CircleCode,
    //             payload.AccountNo,
    //             payload.AccountOther,
    //             payload.Optional1,
    //             payload.Optional2,
    //             payload.Optional3,
    //             payload.Optional4,
    //             payload.Version,
    //             payload.Location,
    //         )
    //         console.log(response.data);
    //         Alert.alert(response.data.MESSAGE);
    //     } catch (error) {
    //         console.error('Error during recharge:', error);
    //         setError('An error occurred while processing the recharge. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const handleRecharge = () => {
        console.log("Recharge");
        navigation.replace('EnterPin', {
            mobileNumber: MobileNo,
            amount: Amount,
            opcodenew: opcodenew,
        });
    }

    useEffect(() => {
        if (number) {
            setMobileNo(number);
        }
    }, [number]);

    const handleCustomerInfo = async () => {
        try {
            const payload = {
                Tokenid: userData.tokenid,
                Operator: opcodenew,
                DTHNO: MobileNo,
                Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
                Location: null
            }
            const response = await PlanService.DTHInfo(
                payload.Tokenid,
                payload.Operator,
                payload.DTHNO,
                payload.Version,
                payload.Location
            );
            console.log(response.data);
            setCustomerInfoData(response.data);
            setCustomerInfo(true);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <GradientLayout>
            <SafeAreaView className="p-4 flex-1">
                <Header headingTitle={mode === "1" ? "Mobile Recharge" : "DTH Recharge"} screenName={mode === "1" ? "MobileRechargeScreen" : "DTHRechargeScreen"} />
                {
                    showContactList ? (
                        <Modal visible={showContactList} animationType="slide">
                            <SafeAreaView className="flex-1 bg-white p-4">
                                <Text className="text-xl font-bold mb-4">Select a Contact</Text>
                                <FlatList
                                    data={contacts}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            className="p-3 border-b border-gray-300"
                                            onPress={() => processSelectedContact(item)}
                                        >
                                            <Text className="text-lg font-semibold">{item.name}</Text>
                                            <Text className="text-gray-600">{item.phoneNumbers[0]?.number}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowContactList(false)}
                                    className="mt-4 p-3 bg-gray-200 rounded-full items-center"
                                >
                                    <Text className="text-red-600 font-bold">Cancel</Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </Modal>

                    ) :
                        <ScrollView className="flex-1"
                            showsVerticalScrollIndicator={false}
                        >

                            {/* Operator image and name */}
                            {customerInfo ? (
  <View
    style={{
      backgroundColor: '#E6F4FF', // light blue background
      padding: 16,
      margin: 10,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#007AFF' }}>
      Customer Info
    </Text>

    <Text style={styles.infoText}>Name: {customerInfoData?.DATA?.Name || 'N/A'}</Text>
    <Text style={styles.infoText}>Balance: ₹{customerInfoData?.DATA?.Balance || 'N/A'}</Text>
    <Text style={styles.infoText}>District: {customerInfoData?.DATA?.District || 'N/A'}</Text>
    <Text style={styles.infoText}>Monthly: {customerInfoData?.DATA?.Monthly || 'N/A'}</Text>

    <TouchableOpacity
      onPress={() => setCustomerInfo(false)}
      style={{
        marginTop: 16,
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Hide Info</Text>
    </TouchableOpacity>
  </View>
) : (
  <View className="items-center mb-2">
    <Image
      source={{ uri: operator.image }}
      style={{ width: 100, height: 100, borderRadius: 50 }}
      resizeMode="cover"
    />
    <Text className="text-lg font-bold mt-2">{operator.name}</Text>
  </View>
)}


                            {/* Mobile Number Input */}
                            <View className="bg-white rounded-full flex-row items-center px-6 mb-4 mt-5" style={{ height: 60 }}>
                                <FontAwesome name="mobile-phone" size={36} color="#03a5fc" />
                                <TextInput
                                    placeholder="Mobile Number"
                                    className="flex-1 py-2 text-gray-700 pl-6 font-bold text-2xl"
                                    placeholderTextColor="#888"
                                    keyboardType="numeric"
                                    value={MobileNo}

                                    onChangeText={(text) => {
                                        // Ensure only digits and max 10 characters
                                        const formattedText = text.replace(/\D/g, '').substring(0, 10);
                                        setMobileNo(formattedText);
                                    }}
                                    maxLength={10}
                                />
                                {
                                    mode === "1" ?
                                        <TouchableOpacity onPress={openContacts}>
                                            <AntDesign name="contacts" size={32} color="#666" />
                                        </TouchableOpacity> : ""
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
                                        <CustomButton width="48%"  title="Recharge" />
                                        <CustomButton width="48%" title="Browse Plans" onPress={() => navigation.navigate('BrowsePlan')} />
                                    </View>
                                    :
                                    <View style={{ marginBottom: 16, gap: 10 }}>
                                        <CustomButton title="Recharge" />
                                        <CustomButton title="Customer Info" onPress={handleCustomerInfo} />
                                        <CustomButton title="DTH Plan" />
                                        <CustomButton title="Refresh DTH Service" />
                                    </View>
                            }

                            {loading ? <CustomButton title="Proceeding..." disabled /> : <CustomButton title="Proceed" onPress={() => {
                                showConfirmation();
                            }} />}

                            {/* Note */}
                            <View className="mt-4">
                                <Text className="text-gray-500 font-bold text-sm">
                                    Note: Please verify {mode === "1" ? "recharge" : "DTH"} amount and benefits with your operator before proceeding. Plans have been shown basis latest available informatin and might not be accurate always. You can choose to DTH with any amount and benefit will be decided by your {mode === "1" ? "recharge" : "DTH"} operator.
                                </Text>

                            </View>
                        </ScrollView>
                }

                {/* Confirmation Modal */}
                <Modal
                    visible={showConfirmationModal}
                    transparent={false}
                    animationType="fade"
                    onRequestClose={() => setShowConfirmationModal(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                        <View className="bg-white p-6 rounded-xl w-5/6 items-center">
                            {/* Operator Image */}
                            <Image
                                source={{ uri: operator?.image }}
                                style={{ width: 80, height: 80, borderRadius: 40 }}
                                resizeMode="cover"
                            />

                            {/* Confirmation Details */}
                            <Text className="text-xl font-bold mt-4">Recharge of {operator?.name}</Text>
                            <Text className="font-bold text-lg underline text-blue-900">{MobileNo}</Text>
                            <Text className="font-bold text-lg mb-4">₹{Amount}</Text>
                            <Text className="text-gray-600 text-center mb-4">
                                Please recheck the number and amount again. Wrong recharge is not entertained in any circumstances.
                            </Text>
                            <View className="flex-row justify-between w-full mt-2">
                                <TouchableOpacity
                                    className="bg-gray-300 py-3 px-6 rounded-full"
                                    onPress={() => setShowConfirmationModal(false)}
                                >
                                    <Text className="font-bold text-gray-700">Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-green-500 py-3 px-6 rounded-full"
                                    onPress={handleRecharge}
                                >
                                    <Text className="font-bold text-white">Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </GradientLayout>
    );
};

export default CompanyRechargeScreen;

const styles = StyleSheet.create({
    infoText: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
});