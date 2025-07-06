import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../component/Header'
import GradientLayout from '../component/GradientLayout'
import SupportService from '../services/SupportService'
import { useSelector, useDispatch } from 'react-redux';
//import Constants from 'expo-constants';
import CustomButton from '../component/button'
const SupportScreen = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const [support, setSupport] = useState([])
    const [loading, setLoading] = useState(false)

    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>{item.PName}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Customer Care No:</Text>
                    <Text style={styles.value}>{item.PValue}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Priority:</Text>
                    <Text style={styles.value}>{item.Priority}</Text>
                </View>
            </View>
        );
    };

    useEffect(() => {
        const fetchSupport = async () => {
            try {
                setLoading(true);
                const payload = {
                    Tokenid: userData.tokenid,
                    Version: '1',
                    Location: null,
                };
                const response = await SupportService.Support(payload.Tokenid, payload.Version, payload.Location)
                const data = response.data
                setSupport(data.List);
                console.log(support);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSupport()
    }, []);
    
    return (
        <GradientLayout>
            <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <Header headingTitle={'Help & Support'} />
            
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Support</Text>
                </View>
                {loading ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <View>
                        <FlatList
                            data={support}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: 200 }}
                            ListEmptyComponent={<Text>No data found</Text>}
                            showsVerticalScrollIndicator={false}
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
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 10,
        elevation: 3, // for Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "navy",
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        color: "blue",
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
        color: "purple",
    },
});
