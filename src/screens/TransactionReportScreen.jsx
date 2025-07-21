import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  Alert,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import Header from "../component/Header";
import GradientLayout from "../component/GradientLayout";
import ReportService from "../services/reportService";
// import Constants from "expo-constants";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../utils/authUtils';
import {  moderateScale } from '../utils/responsive';

// Helper functions

export default function TransactionReportScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const payload = {
          Tokenid: userData.tokenid,
          Startdate: "",
          status: null,
          Enddate: "",
          MobileNo: userData.mobilenumber,
          PageIndex: "0",
          PageSize: "10",
          Version: "1",
          Location: null,
        };

        const response = await ReportService.TransactionReport(
          payload.Tokenid,
          payload.Startdate,
          payload.status,
          payload.Enddate,
          payload.MobileNo,
          payload.Version,
          payload.Location
        );
        const data = response.data;
        console.log("data",data);
        if(data.STATUSCODE !== '1'){
          setShowErrorModal(true);
          setErrorMessage("Authentication failed");
        }
        if (data.ERROR === "0") {
          if(data.REPORT != null){
          const formattedData = data.REPORT.map((item, index) => ({
            id: index.toString(),
            TranscationID: item.TranscationID,
            Date: item.Date,
            Type: item.Type,
            OpeningBalance: item.OpneningBalance || item.OpeninigBalance,
            ClosingBalance: item.ClosingAmount,
            CreditAmount: item.CreditAmount,
            DebitAmount: item.DebitAmount,
          }));
          setServices(formattedData);
        }
        else{
          Alert.alert("Error", data.MESSAGE,
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
          console.log("Api Error: ", data.MESSAGE);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions(); // Fetch all on mount
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>
          Transaction ID: {item.TranscationID}
        </Text>
      </View>

      <View style={styles.row}>
        <Text>📅</Text>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{new Date(item.Date).toLocaleString()}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Text>📱</Text>
        <Text style={styles.label}>Type</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{item.Type}</Text>
        </View>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Text>💰</Text>
        <Text style={styles.label}>Opening Balance</Text>
        <Text style={styles.value}>{item.OpeningBalance}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Text>💰</Text>
        <Text style={styles.label}>Closing Balance</Text>
        <Text style={styles.value}>{item.ClosingBalance}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Text>💰</Text>
        <Text style={styles.label}>Credit Amount</Text>
        <Text style={styles.value}>{item.CreditAmount}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Text>💰</Text>
        <Text style={styles.label}>Debit Amount</Text>
        <Text style={styles.value}>{item.DebitAmount}</Text>
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <GradientLayout>
      <SafeAreaView style={{ padding: 16 }}>
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
        <Header headingTitle="All Transaction Reports" />
        <FlatList
          data={services}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </SafeAreaView>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    paddingVertical: 6,
    fontSize: moderateScale(16),
    textAlign: "center",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  dateInput: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  dateLabel: {
    fontSize: moderateScale(12),
    marginTop: 4,
    color: "#333",
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: "#f97316",
    paddingVertical: 12,
    borderRadius: 10,
  },
  searchButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  cardHeaderText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: 'black'
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    marginLeft: 8,
    color: "blue",
    fontSize: moderateScale(14),
  },
  value: {
    fontWeight: "bold",
    color: "purple",
    fontSize: moderateScale(14),
  },
  separator: {
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: "#ccc",
    marginVertical: 4,
  },
  valueContainer: {
    width: "60%",
    alignItems: "flex-end",
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
  modalMessage: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 24
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 25
  },  
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  }   


});
