import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image,ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../component/Header'
import GradientLayout from '../component/GradientLayout'
import SupportService from '../services/SupportService'
import logo from '../../assets/logo.png'
//import Constants from 'expo-constants';
import { useSelector } from 'react-redux';
import { horizontalScale, verticalScale } from '../utils/responsive'
import { useIsFocused } from '@react-navigation/native';
import {Feather,Entypo,MaterialIcons} from '@expo/vector-icons';
import { handleCallPress } from '../component/Commonfunction';
const SupportScreen = () => {
    const userData = useSelector(state => state.user)
    const [contactData, setContactData] = useState([])
    const [loading, setLoading] = useState(false)
    const isFocused = useIsFocused();



    useEffect(() => {
        if(isFocused){
        const fetchContact = async () => {
            try {
                setLoading(true);
                const payload = {
                    Tokenid: userData.tokenid,
                    Version: '1',
                    Location: null,
                };
                const response = await SupportService.Contact(payload.Tokenid, payload.Version, payload.Location)
                const data = response.data
                console.log(data);
                setContactData(data.Details);
                contactData.forEach(item => {
                    console.log(item);
                });
                console.log(contactData)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchContact()
        }
    }, [isFocused]);

    return (
        <GradientLayout>
            <SafeAreaView style={styles.container}>
                <Header headingTitle={'Contact Us'} />
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <ScrollView>
                    <View>
                            <View style={styles.card}>
                                <View style={{justifyContent:'space-between'}}> 
                                <Text style={styles.keyText}>Company Name  </Text>
                                <Text style={styles.valueText}>{contactData[0]?.CompanyName}</Text>
                                <Text style={styles.valueText}>{contactData[0]?.officeAddress}</Text>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Image source={logo} style={{width:60,height:30}}/>
                                </View>
                            </View>
                            <View style={styles.card}>
                                <View style={{justifyContent:'space-between'}}>
                                <Text style={styles.keyText}>HangOut</Text>
                                <Text style={styles.valueText}>{contactData[0]?.HangoutId}</Text>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Feather name="message-circle" size={30} color="green" />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.card} onPress={() => handleCallPress()}>
                                <View style={{justifyContent:'space-between'}}>
                                <Text style={styles.keyText}>Customer Care</Text>
                                <Text style={styles.valueText}>{contactData[0]?.phoneno}</Text>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Entypo name="old-phone" size={30} color="red" />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.card}>
                                <View style={{justifyContent:'space-between'}}>
                                <Text style={styles.keyText}>Support Hours</Text>
                                <Text style={styles.valueText}>Mon to Sat: 09:00 AM to 9:00 PM</Text>
                                <Text style={styles.valueText}>Sun: 9:30 AM to 5:30 PM</Text>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                <MaterialIcons name="support-agent" size={30} color="green" />
                                </View>
                            </View>
                            <View style={styles.card}>
                                <View style={{justifyContent:'space-between'}}>
                                <Text style={styles.keyText}>Support Email</Text>
                                <Text style={styles.valueText}>{contactData[0]?.supportId}</Text>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Entypo name="mail" size={30} color="red" />
                                </View>
                            </View>
                    </View>
                </ScrollView>
                )}
            </SafeAreaView>
        </GradientLayout>
    )
}

export default SupportScreen

const styles = StyleSheet.create({
    companyBlock: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 10,
      },
      card: {
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      keyText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'blue'
      },
      valueText: {
        fontSize: 13,
        color: 'purple',
        marginTop: 4,
      },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        fontWeight: '600',
        width: 110,
        color: '#555',
    },
    value: {
        flex: 1,
        color: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
    },
});

