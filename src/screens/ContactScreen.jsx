import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../component/Header'
import GradientLayout from '../component/GradientLayout'
import SupportService from '../services/SupportService'
import Constants from 'expo-constants';
import { useSelector } from 'react-redux';
const SupportScreen = () => {
    const userData = useSelector(state => state.user)
    const [contactData, setContactData] = useState([])
    const [loading, setLoading] = useState(false)

    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <Text style={styles.companyName}>{item.CompanyName}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{item.supportId}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{item.phoneno}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Website:</Text>
                    <Text style={styles.value}>{item.WebSiteName}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{item.officeAddress}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Hangout ID:</Text>
                    <Text style={styles.value}>{item.HangoutId}</Text>
                </View>
            </View>
        );
    };


    useEffect(() => {
        const fetchContact = async () => {
            try {
                setLoading(true);
                const payload = {
                    Tokenid: userData.tokenid,
                    Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
                    Location: null,
                };
                const response = await SupportService.Contact(payload.Tokenid, payload.Version, payload.Location)
                const data = response.data
                setContactData(data.Details);
                console.log(contactData);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchContact()
    }, []);

    return (
        <GradientLayout>
            <SafeAreaView className='px-4 pt-4'>
                <Header headingTitle={'Help & Support'} />
                <View className='justify-center items-center'>
                    <Text className='text-2xl font-bold'>Contact Us</Text>
                </View>
                {loading ? (
                    <View className='justify-center items-center'>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <View>
                        <FlatList
                            data={contactData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: 30 }}
                            ListFooterComponent={<View style={{ height: 20 }} />}
                        />
                    </View>
                )}
            </SafeAreaView>
        </GradientLayout>
    )
}

export default SupportScreen

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
});

