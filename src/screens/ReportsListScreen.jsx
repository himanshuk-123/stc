import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, Button } from 'react-native'
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
        <View className="bg-white rounded-2xl shadow-md p-4 mb-4 flex-row items-center">
      <Image
        source={{ uri: `https://onlinerechargeservice.in/${item.images.replace(/^~\//, '')}` }} // Replace with real URL
        className="w-12 h-12 rounded-full mr-4"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.Operator} - ₹{item.Amount}</Text>
        <Text className="text-sm text-gray-600">Mobile: {item.MobileNO}</Text>
        <Text className="text-sm text-gray-600">Name: {item.FullName}</Text>
        <Text className="text-xs text-gray-400">{formatDate(item.Date)}</Text>
      </View>
      <View
        className={`px-2 py-1 rounded-full ${
          item.Status === 'Success'
            ? 'bg-green-100'
            : item.Status === 'Failed'
            ? 'bg-red-100'
            : 'bg-yellow-100'
        }`}
      >
        <Text
          className={`text-xs font-bold ${
            item.Status === 'Success'
              ? 'text-green-700'
              : item.Status === 'Failed'
              ? 'text-red-700'
              : 'text-yellow-700'
          }`}
        >
          {item.Status}
        </Text>
      </View>
    </View>
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
    }
})

export default ReportsListScreen