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
//import Constants from 'expo-constants';
import ReportService from '../services/reportService';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../utils/authUtils';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
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
      Version: '1',
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
      <View style={styles.headerRow}>
      <Text style={styles.label}>📅 Date:</Text>
      <Text style={styles.value}>{new Date(item.Date).toLocaleString()}</Text>
      </View>
      <View style={styles.headerRow}>
      <Text style={styles.label}>📱 Mobile No:</Text>
      <Text style={styles.value}>{item.MobileNo}</Text>
      </View>
      <View style={styles.headerRow}>
      <Text style={styles.label}>📦 Status:</Text>
      <Text style={[styles.status, item.Status === 'Success' ? styles.success : styles.failed]}>
        {item.Status}
      </Text>
      </View>
      <View style={styles.headerRow}>
      <Text style={styles.label}>🆔 Complain ID:</Text>
      <Text style={styles.value}>{item.ComplainID}</Text>
      </View>
      <View style={styles.headerRow}>
      <Text style={styles.label}>📝 Complain Status:</Text>
      <Text style={styles.value}>{item.ComplainStatus}</Text>
      </View>
      <View style={styles.headerRow}>
      <Text style={styles.label}>🗣️ User Remark:</Text>
      <Text style={styles.value}>{item.Remark || 'N/A'}</Text>
      </View>
      <View style={styles.headerRow}>
      <Text style={styles.label}>📩 Admin Message:</Text>
      <Text style={styles.value}>{item.Massage || 'N/A'}</Text>
      </View>
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alert</Text>
              <Text style={styles.modalText}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleErrorModalOk}
              >
                <Text style={styles.modalButtonText}>OK</Text>
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
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: 'blue',
    marginTop: 6,
  },
  value: {
    fontSize: moderateScale(15),
    color: 'purple',
    marginBottom: 4,
    flexShrink: 1,
  },
  status: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    marginBottom: 4,
  },
  success: {
    color: '#2e7d32',
  },
  failed: {
    color: '#d32f2f',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
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
  modalText: {
    color: '#333',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  balanceModalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center'
  },
  modalLogo: {
    width: verticalScale(100),
    height: verticalScale(100),
    marginBottom: verticalScale(16)
  },balanceModalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 9999,
    marginTop: 16
  },
  balanceModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
});
