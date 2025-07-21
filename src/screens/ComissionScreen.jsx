import { View, Text, SafeAreaView, FlatList, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RechargeApiServices from '../services/RechargeService';
//import Constants from 'expo-constants';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../utils/authUtils';
import commission from '../../assets/commissionImg.png';
    const ComissionScreen = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const [commissionList, setCommissionList] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchCommission = async () => {
            setLoading(true);
            try {
                const token = userData.tokenid;
                const payload = {
                    Tokenid: token,
                    Version: '1',
                    Location: null,
                };

                const response = await RechargeApiServices.commission(
                    payload.Tokenid,
                    payload.Version,
                    payload.Location
                );
                const data = response.data;

                console.log("API Response: ", data);
                if (data.STATUSCODE !== '1') {
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
            } finally {
                setLoading(false);
            }

        };

        fetchCommission();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.cardContainer}>
            <View style={styles.cardimgContainer}>
                <Text style={styles.commAmt}>{item.CommAmt} %</Text>
            </View>
            <View style={{ flex: 3, flexDirection: 'row', marginLeft: 30 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={commission} style={{ width: 40, height: 40 }} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.name}>{item.Name}</Text>
                    <Text style={styles.operatorType}>{item.OperatorType}</Text>
                    <Text style={styles.operatorType}>{item.margintype}</Text>
                </View>
            </View>
        </View>
    );

    const handleErrorModalOk = () => {
        setShowErrorModal(false);
        logout();
    };
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    }
    return (
        <GradientLayout>
            <SafeAreaView style={styles.safeArea}>
                <Modal
                    visible={showErrorModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleErrorModalOk}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Alert</Text>
                            <Text style={styles.modalMessage}>{errorMessage}</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleErrorModalOk}
                            >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Header headingTitle="Your Commission" />
                <View style={styles.headerRow}>
                    <Text style={styles.headerText}>Provider</Text>
                    <Text style={styles.headerText}>% / ₹</Text>
                    <Text style={styles.headerText}>Type</Text>
                </View>
                <FlatList
                    data={commissionList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>No commission data available</Text>}
                />
            </SafeAreaView>
        </GradientLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    safeArea: {
        flex: 1,
        padding: 16
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8, 
        marginBottom: 8, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.2,
        shadowRadius: 1.41, 
        elevation: 2, 
        borderWidth: 1, 
        borderColor: '#e5e7eb', 
        padding: 10
    },
    cardimgContainer: { 
        flex: 1, 
        alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderColor: 'red' },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 4,
    },
    operatorType: {
        fontSize: 14,
        color: 'purple',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 8,
        marginBottom: 8
    },
    headerText: {
        fontWeight: '600',
        color: 'black',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 16
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16
    },
    modalMessage: {
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 24
    },
    modalButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 48,
        borderRadius: 9999
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    commAmt: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    }
});

export default ComissionScreen;
