import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, Link, SafeAreaView, TextInput, Image, ScrollView, Alert, ActivityIndicator, FlatList, TouchableOpacity, Platform, Modal, StyleSheet, PermissionsAndroid } from 'react-native';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import CustomButton from '../component/button';
import contact from '../../assets/contact.jpeg'
import { useNavigation } from '@react-navigation/native';
import { PlanService } from '../services/PlanService';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleRecharge as rechargeApiCall } from '../component/Commonfunction';
import phone from '../../assets/phone_icon.png'
const CompanyRechargeScreen = ({ route }) => {
    const { operator, mode, opcodenew, number, price } = route.params;
    const [MobileNo, setMobileNo] = useState(operator.MobileNO ? operator.MobileNO : number || '');
    const [Amount, setAmount] = useState(price || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [contacts, setContacts] = useState([]);
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
    const userData = useSelector(state => state.user);

    // const handleOpenContacts = async () => {
    //     if (Platform.OS === 'android') {
    //         const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
    //         const alreadyGranted = await PermissionsAndroid.check(permission);
    //         if (alreadyGranted) {
    //             console.log('Contacts permission already granted');
    //         } else {
    //             const requestResult = await PermissionsAndroid.request(permission);
    //             if (requestResult === PermissionsAndroid.RESULTS.GRANTED) {
    //                 console.log('Contacts permission granted after request');
    //             } else {
    //                 Alert.alert(
    //                     'Permission Required',
    //                     'Please allow contact access from settings to use this feature.'
    //                 );
    //             }
    //         }
    //     } else {
    //         console.warn('This is Android-only code');
    //     }
    // };

    // const isValidUrl = (url) => url?.startsWith('http');

    const imageToShow = operator?.image
        ? operator.image
        : `https://onlinerechargeservice.in/${operator.images.replace(/^~\//, '')}`

    useEffect(() => {
        if (price) {
            setAmount(price.toString());
        }
    }, [price]);

    const openContacts = async () => {
        try {
            await handleOpenContacts();
            const { data } = await Contacts.getAll();
            const filtered = data.filter(
                c => c.phoneNumbers && c.phoneNumbers.length > 0
            );
            setContacts(filtered);
            setShowContactList(true);  // Show contact list
        } catch (error) {
            Alert.alert('Error', 'Could not access contacts.');
        }
    };
    // const pickContact = async () => {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.READ_CONTACTS
    //     );

    //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //       Alert.alert("Permission Denied", "Cannot open contacts without permission");
    //       return;
    //     }

    //     try {
    //       const contact = await selectContactPhone();
    //       if (contact) {
    //         console.log("Selected Contact:", contact);
    //         setMobileNo(contact.selectedPhone.number);
    //         console.log("contact", contact);
    //         setShowContactList(false);
    //       }
    //     } catch (err) {
    //       console.log("Picker Error", err);
    //       console.log("Picker Error:", JSON.stringify(err, null, 2));

    //       Alert.alert("Error", "Could not open contact picker.");
    //     }
    //   };
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

    const handleRechargePress = async () => {
        try {
            setLoading(true);
            const pinStatus = await AsyncStorage.getItem('isPinEnabled');
            if (pinStatus === 'true') {
                navigation.replace('EnterPin', {
                    MobileNo,
                    Amount,
                    opcodenew: opcodenew ? opcodenew : operator.OpTypeId,
                });
            } else {
                await rechargeApiCall({ userData, MobileNo, opcodenew: opcodenew ? opcodenew : operator.OpTypeId, Amount, navigation, setLoading, setError });
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    const specialOffers = () => {
        if (MobileNo) {
            navigation.replace('SpecialOffers', { opcodenew: opcodenew ? opcodenew : operator.OpTypeId, number: MobileNo, operator: operator, mode: mode });
        } else {
            Alert.alert('Please enter a valid mobile number');
        }
    }
    const handleCustomerInfo = async () => {
        try {
            const payload = {
                Tokenid: userData.tokenid,
                Operator: opcodenew ? opcodenew : operator.OpTypeId,
                DTHNO: MobileNo,
                Version: '1',
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
            <SafeAreaView style={styles.safeArea}>
                <Header headingTitle={mode === "1" ? "Mobile Recharge" : "DTH Recharge"} screenName={mode === "1" ? "MobileRechargeScreen" : "DTHRechargeScreen"} />
                {
                    showContactList ? (
                        <Modal visible={showContactList} animationType="slide">
                            <SafeAreaView style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Select a Contact</Text>
                                <FlatList
                                    data={contacts}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.contactItem}
                                            onPress={() => processSelectedContact(item)}
                                        >
                                            <Text style={styles.contactName}>{item.name}</Text>
                                            <Text style={styles.contactNumber}>{item.phoneNumbers[0]?.number}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowContactList(false)}
                                    style={styles.cancelButton}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </Modal>
                    ) :
                        <ScrollView style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            {customerInfo ? (
                                <View
                                    style={styles.customerInfoCard}
                                >
                                    <Text style={styles.customerInfoTitle}>
                                        Customer Info
                                    </Text>

                                    <Text style={styles.infoText}>Name: {customerInfoData?.DATA?.Name || 'N/A'}</Text>
                                    <Text style={styles.infoText}>Balance: ₹{customerInfoData?.DATA?.Balance || 'N/A'}</Text>
                                    <Text style={styles.infoText}>District: {customerInfoData?.DATA?.District || 'N/A'}</Text>
                                    <Text style={styles.infoText}>Monthly: {customerInfoData?.DATA?.Monthly || 'N/A'}</Text>

                                    <TouchableOpacity
                                        onPress={() => setCustomerInfo(false)}
                                        style={styles.hideInfoButton}
                                    >
                                        <Text style={styles.hideInfoButtonText}>Hide Info</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.operatorContainer}>
                                    <Image
                                        source={{ uri: imageToShow }}
                                        style={{ width: 100, height: 100, borderRadius: 50 }}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.operatorName}>{operator.name ? operator.name : operator.Operator}</Text>
                                </View>
                            )}

                            <View style={styles.inputContainer}>
                                <Image source={phone} style={{ height: 30, width: 30 }} />
                                <TextInput
                                    placeholder="Mobile Number"
                                    style={styles.input}
                                    placeholderTextColor="#888"
                                    keyboardType="numeric"
                                    value={MobileNo}
                                    onChangeText={(text) => {
                                        const formattedText = text.replace(/\D/g, '').substring(0, 10);
                                        setMobileNo(formattedText);
                                    }}
                                    maxLength={10}
                                    textContentType="telephoneNumber"
                                    importantForAutofill="yes"
                                />

                                {
                                    mode === "1" ?
                                        <TouchableOpacity >
                                            <Image source={contact} style={{ height: 30, width: 30 }} />
                                        </TouchableOpacity> : ""
                                }
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={{ fontSize: 38, color: 'red' }}>₹</Text>
                                <TextInput
                                    placeholder="Amount"
                                    style={styles.input}
                                    placeholderTextColor="#888"
                                    keyboardType="numeric"
                                    value={Amount}
                                    onChangeText={setAmount}
                                    textContentType="none"
                                    importantForAutofill="no"
                                />

                                <Image source={{ uri: imageToShow }} style={styles.operatorImage} resizeMode="contain" />
                            </View>

                            {
                                mode === "1" ? (
                                    opcodenew == "1" || opcodenew == "18" ? (
                                        // When operator is 1 or 18 — show both buttons side by side
                                        <View style={styles.buttonContainer}>
                                            <CustomButton
                                                title="Special Offers"
                                                width="48%"
                                                onPress={specialOffers}
                                            />
                                            <CustomButton
                                                title="Browse Plans"
                                                width="48%"
                                                onPress={() =>
                                                    navigation.navigate('BrowsePlanStateSelection', {
                                                        opcodenew: opcodenew ? opcodenew : operator.OpTypeId,
                                                        mode,
                                                        operator,
                                                        number: MobileNo
                                                    })
                                                }
                                                disabled={loading}
                                            />
                                        </View>
                                    ) : (
                                        // For other operators — show only full-width Browse Plan button
                                        <View style={{ marginBottom: 16 }}>
                                            <CustomButton
                                                title="Browse Plans"
                                                width="100%"
                                                onPress={() =>
                                                    navigation.navigate('BrowsePlanStateSelection', {
                                                        opcodenew: opcodenew ? opcodenew : operator.OpTypeId,
                                                        mode,
                                                        operator,
                                                        number: MobileNo
                                                    })
                                                }
                                                disabled={loading}
                                            />
                                        </View>
                                    )
                                ) : (
                                    // When mode is not 1 — show DTH buttons
                                    <View style={{ marginBottom: 16, gap: 10 }}>
                                        <CustomButton title="Customer Info" onPress={handleCustomerInfo} />
                                        <CustomButton title="DTH Plan" />
                                        <CustomButton title="Refresh DTH Service" />
                                    </View>
                                )
                            }


                            <CustomButton title={loading ? "Proceeding..." : "Proceed"} onPress={showConfirmation} disabled={loading} />

                            <View style={styles.noteContainer}>
                                <Text style={styles.noteText}>
                                    Note: Please verify {mode === "1" ? "recharge" : "DTH"} amount and benefits with your operator before proceeding. Plans have been shown basis latest available informatin and might not be accurate always. You can choose to DTH with any amount and benefit will be decided by your {mode === "1" ? "recharge" : "DTH"} operator.
                                </Text>
                            </View>
                        </ScrollView>
                }

                <Modal
                    visible={showConfirmationModal}
                    transparent={false}
                    animationType="fade"
                    onRequestClose={() => setShowConfirmationModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Image
                                source={{ uri: imageToShow }}
                                style={{ width: 80, height: 80, borderRadius: 40 }}
                                resizeMode="cover"
                            />

                            <Text style={styles.modalTitle}>Recharge of {operator?.name ? operator.name : operator.Operator}</Text>
                            <Text style={styles.modalNumber}>{MobileNo}</Text>
                            <Text style={styles.modalAmount}>₹{Amount}</Text>
                            <Text style={styles.modalNote}>
                                Please recheck the number and amount again. Wrong recharge is not entertained in any circumstances.
                            </Text>
                            <View style={styles.modalButtonContainer}>
                                <CustomButton title="Cancel" width='48%' onPress={() => setShowConfirmationModal(false)} disabled={loading} />

                                <CustomButton title={loading ? 'Proceeding...' : 'Continue'} width='48%' onPress={handleRechargePress} disabled={loading} />
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
    safeArea: {
        flex: 1,
        padding: 16
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16
    },
    contactItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    contactName: {
        fontSize: 18,
        fontWeight: '600'
    },
    contactNumber: {
        color: '#666'
    },
    cancelButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        alignItems: 'center'
    },
    cancelButtonText: {
        color: '#dc2626',
        fontWeight: 'bold'
    },
    scrollView: {
        flex: 1
    },
    customerInfoCard: {
        backgroundColor: '#E6F4FF',
        padding: 16,
        margin: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    customerInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007AFF'
    },
    hideInfoButton: {
        marginTop: 16,
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center'
    },
    hideInfoButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    operatorContainer: {
        alignItems: 'center',
        marginBottom: 8
    },
    operatorImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    operatorName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8
    },
    inputContainer: {
        backgroundColor: 'white',
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 20,
        height: 60
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        paddingLeft: 24,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a4a4a'
    },
    smallOperatorImage: {
        width: 55,
        height: 35
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    dthButtonContainer: {
        marginBottom: 16,
        gap: 10
    },
    noteContainer: {
        marginTop: 16
    },
    noteText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 14
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'black'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 12,
        width: '83%',
        alignItems: 'center',
        color: 'black'
    },
    modalOperatorImage: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    modalNumber: {
        fontWeight: 'bold',
        fontSize: 18,
        textDecorationLine: 'underline',
        color: '#1e3a8a',
        color: 'black'
    },
    modalAmount: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 16,
        color: 'black'
    },
    modalWarning: {
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
        color: 'black'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
        color: 'black'
    },
    cancelModalButton: {
        backgroundColor: '#d1d5db',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        color: 'black'
    },
    cancelModalButtonText: {
        fontWeight: 'bold',
        color: '#4b5563',
        color: 'black'
    },
    continueButton: {
        backgroundColor: '#22c55e',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        color: 'black'
    },
    continueButtonText: {
        fontWeight: 'bold',
        color: 'white',
        color: 'black'
    },
    infoText: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
        color: 'black'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
        color: 'black'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'black'
    },
    modalText: {
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
        color: 'black'
    },
    modalButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 48,
        borderRadius: 9999,
        color: 'black'
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black'
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        color: 'black',
    },
    modalNote: {
        color: '#5a5e5b',
        marginBottom: 10,
        fontSize: 12,
        fontWeight: 'bold'
    }


});