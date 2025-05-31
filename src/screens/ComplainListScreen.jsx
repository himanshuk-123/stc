import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import ReportService from '../services/reportService';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../utils/authUtils';
import { moderateScale } from '../utils/responsive';
const ComplainListScreen = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
    const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
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
      console.log("API Response: ", response.data);
      if(response.data.STATUSCODE !== '1'){
        setShowErrorModal(true);
          setErrorMessage("Authentication failed");
      }
      if (response.data.ERROR === "0") {
        if(response.data.REPORT != null){
          setReportData(response.data.REPORT || []);
        }
        else{
          Alert.alert("Error", response.data.MESSAGE,
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]
          );
        }
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
      <View style={styles.headerRow}>
        <Text style={styles.txnId}>TXN ID: {item.TransactionID}</Text>
        <Text style={styles.amount}>₹{item.Amount}</Text>
      </View>
  
      <Text style={styles.label}>📅 Date:</Text>
      <Text style={styles.value}>{new Date(item.Date).toLocaleString()}</Text>
  
      <Text style={styles.label}>📱 Mobile No:</Text>
      <Text style={styles.value}>{item.MobileNo}</Text>
  
      <Text style={styles.label}>📦 Status:</Text>
      <Text style={[styles.status, item.Status === 'Success' ? styles.success : styles.failed]}>
        {item.Status}
      </Text>
  
      <Text style={styles.label}>🆔 Complain ID:</Text>
      <Text style={styles.value}>{item.ComplainID}</Text>
  
      <Text style={styles.label}>📝 Complain Status:</Text>
      <Text style={styles.value}>{item.ComplainStatus}</Text>
  
      <Text style={styles.label}>🗣️ User Remark:</Text>
      <Text style={styles.value}>{item.Remark || 'N/A'}</Text>
  
      <Text style={styles.label}>📩 Admin Message:</Text>
      <Text style={styles.value}>{item.Massage || 'N/A'}</Text>
    </View>
  );
  
  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };
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
    <Modal
          visible={showErrorModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleErrorModalOk}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-xl w-4/5 items-center">
              <Text className="text-xl font-bold mb-4">Alert</Text>
              <Text className="text-gray-800 text-center mb-6">{errorMessage}</Text>
              <TouchableOpacity
                className="bg-blue-500 py-3 px-12 rounded-full"
                onPress={handleErrorModalOk}
              >
                <Text className="text-white font-bold text-lg">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    fontSize: moderateScale(12),
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4facfe',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  txnId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4caf50',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 6,
  },
  value: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  success: {
    color: '#2e7d32',
  },
  failed: {
    color: '#d32f2f',
  },
});
