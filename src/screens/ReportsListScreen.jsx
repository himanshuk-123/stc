import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReportService from '../services/reportService'
import GradientLayout from '../component/GradientLayout'
import Header from '../component/Header'
import { verticalScale } from '../utils/responsive'
const ReportsListScreen = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [reportsList, setReportsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchReportsList = async () => {
    try{
        const payload = {
            Tokenid: userData.tokenid,
            Startdate: null,
            status: null,
            Enddate: null,
            MobileNo: null,
            Version: userData.version,
            Location: userData.location
        }
        console.log(payload);
        const response = await ReportService.REPORTSLIST(
            payload.Tokenid,
            payload.Startdate,
            payload.status,
            payload.Enddate,
            payload.MobileNo,
            payload.Version,
            payload.Location
        )
        console.log(response.data);
        setReportsList(response.data.REPORT);
        setLoading(false);
    }catch(error){
        console.log(error);
    }
    }
    fetchReportsList();
  },[])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Format as "1/2/2025, 10:56 AM"
  };

  const renderItem = ({item}) => {
    return (
        <View style={styles.card}>
          <Image
            source={{ uri: `https://onlinerechargeservice.in/${item.images.replace(/^~\//, '')}` }}
            style={styles.avatar}
            resizeMode="contain"
          />
          <View style={styles.cardContent}>
            <Text style={styles.title}>{item.Operator} - ₹{item.Amount}</Text>
            <Text style={styles.subtitle}>Mobile: {item.MobileNO}</Text>
            <Text style={styles.subtitle}>Name: {item.FullName}</Text>
            <Text style={styles.date}>{formatDate(item.Date)}</Text>
          </View>
          <View style={[
            styles.statusContainer,
            item.Status === 'Success' ? styles.successBg :
            item.Status === 'Failed' ? styles.failedBg :
            styles.pendingBg
          ]}>
            <Text style={[
              styles.statusText,
              item.Status === 'Success' ? styles.successText :
              item.Status === 'Failed' ? styles.failedText :
              styles.pendingText
            ]}>
              {item.Status}
            </Text>
          </View>
        </View>
    )
  }

  if(loading){
    return (
      <GradientLayout>
        <ActivityIndicator size="large" color="#0000ff" style={{flex:1,justifyContent:'center',alignItems:'center'}} />
      </GradientLayout>
    )
  }
  return (
    <GradientLayout>
            <View style={styles.header}>
                <Header headingTitle="Reports List" />
            </View>
        <SafeAreaView style={styles.container}>
            <FlatList
                data={reportsList}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                contentContainerStyle={styles.content}
                ListEmptyComponent={<Text>No data found</Text>}
            />
        </SafeAreaView>
    </GradientLayout>
  )
}

const styles = StyleSheet.create({
    header: {
        marginTop: verticalScale(15),
        marginHorizontal: verticalScale(15)
    },
    container: {
        flex: 1,
        margin: verticalScale(10)
    },
    content: {
        margin: verticalScale(10)
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    cardContent: {
        flex: 1
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'blue'
    },
    subtitle: {
        fontSize: 14,
        color: 'purple'
    },
    date: {
        fontSize: 12,
        color: 'green'
    },
    statusContainer: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 9999
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    successBg: {
        backgroundColor: '#dcfce7'
    },
    failedBg: {
        backgroundColor: '#fee2e2'
    },
    pendingBg: {
        backgroundColor: '#fef3c7'
    },
    successText: {
        color: '#15803d'
    },
    failedText: {
        color: '#b91c1c'
    },
    pendingText: {
        color: '#b45309'
    }
})

export default ReportsListScreen