import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
  TouchableOpacity
} from "react-native";
// import Constants from "expo-constants";
import ReportService from "../services/reportService";
import Header from "../component/Header";
import GradientLayout from "../component/GradientLayout";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../utils/authUtils';
import { horizontalScale, verticalScale } from '../utils/responsive';
export default function FundRequestListScreen() {
  const [fundList, setFundList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
    const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    const fetchFundList = async () => {
      setLoading(true);
      try {
        const payload = {
          Tokenid: userData.tokenid,
          PageIndex: 1,
          PageSize: 20,
          Version: "1",
          Location: null,
        };

        const response = await ReportService.FundRequestList(
          payload.Tokenid,
          payload.PageIndex,
          payload.PageSize,
          payload.Version,
          payload.Location
        );

        const data = response.data;
        if(data.STATUSCODE !== '1'){
          setShowErrorModal(true);
          setErrorMessage(data.MESSAGE);
        }
        if (data.ERROR === "0") {
          if(data.FUNDLIST != null){
            setFundList(data.FUNDLIST);
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
          console.log("API Error:", data.MESSAGE);
        }
      } catch (error) {
        console.error("Error fetching fund list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFundList();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Cheque No:</Text>
        <Text style={styles.value}>{item.Chequeno}</Text>
        <Text style={styles.amount}>₹{item.amount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Added Date:</Text>
        <Text style={styles.value}>{new Date(item.AddedDate).toLocaleString()}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Mode:</Text>
        <Text style={styles.value}>{item.Mode}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, item.Status_type === "Approved" && { color: "green" }]}>
          {item.Status_type}
        </Text>
      </View>
    </View>
  );

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };

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
        <Header headingTitle="Fund Request List" />
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={fundList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    fontWeight: "600",
    color: "blue",
  },
  value: {
    color: "purple",
    flex: 1,
    textAlign: "right",
  },
  amount: {
    fontWeight: "bold",
    color: "green",
    marginLeft: 10,
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
    marginBottom: 16,
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
  },
});
