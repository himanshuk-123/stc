import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import Constants from 'expo-constants';
import ReportService from '../services/reportService';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
const ComplainListScreen = () => {
  const { userData } = useContext(UserContext);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComplainList(); // Automatically call on screen open
  }, []);

  const fetchComplainList = async () => {
    const payload = {
      Tokenid: userData.tokenid,
      PageIndex: 1,
      PageSize: 20,
      Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
      Location: null,
    };

    try {
      setLoading(true);
      const response = await ReportService.ComplainList(
        payload.Tokenid,
        payload.PageIndex,
        payload.PageSize,
        payload.Version,
        payload.Location
      );
      if (response.data.ERROR === "0") {
        setReportData(response.data.REPORT || []);
      } else {
        console.log("API Error: ", response.data.MESSAGE);
      }
    } catch (error) {
      console.log("API Call Failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>TXNID: {item.TransactionID} | ₹{item.Amount}</Text>
      <Text>Date: {new Date(item.Date).toLocaleString()}</Text>
      <Text>Mobile No: {item.MobileNo}</Text>
      <Text>Status: {item.Status}</Text>
      <Text>Complain ID: {item.ComplainID}</Text>
      <Text>Complain Status: {item.ComplainStatus}</Text>
      <Text>User Remark: {item.Remark || 'N/A'}</Text>
      <Text>Admin Message: {item.Massage || 'N/A'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <GradientLayout>
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Header headingTitle="Complain List" />
      {reportData.length === 0 ? (
        <Text style={styles.noData}>No complains found.</Text>
      ) : (
        <FlatList
          data={reportData}
          keyExtractor={(item) => item.ComplainID.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
    </GradientLayout>
  );
};

export default ComplainListScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});
