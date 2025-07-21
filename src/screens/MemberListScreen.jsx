import React, { useContext, useEffect, useState } from "react";
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
  Modal
} from "react-native";
import Header from "../component/Header";
import GradientLayout from "../component/GradientLayout";
import ReportService from "../services/reportService";
    // import Constants from "expo-constants";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../utils/authUtils';
import { moderateScale, verticalScale } from '../utils/responsive';

// Helper functions

export default function MemberListScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    const MemberList = async () => {
      setLoading(true);
      try {
        const payload = {
            Tokenid: userData.tokenid,
            Version: "1",
            Location: null,
        };

        const response = await ReportService.MEMBERLIST(
          payload.Tokenid,
          payload.Version,
          payload.Location
        );
        const data = response.data;
        console.log("Himanshu Kasoudhan: ",data)
        if(data.STATUSCODE !== '1'){
          setShowErrorModal(true);
          setErrorMessage(data.MESSAGE);
        }
        if(data.ERROR === '0'){
          if(data.MEMBERLIST==null){
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
        }else{
          setData(data.MEMBERLIST);
        }
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
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

        MemberList(); // Fetch all on mount
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.FullName}</Text>
  
        <View style={styles.row}>
          <Text>📧</Text>
          <Text style={styles.text}>{item.Email}</Text>
        </View>
        <View style={styles.row}>
          <Text>📞</Text>
          <Text style={styles.text}>{item.MobileNumber}</Text>
        </View>
  
        <View style={styles.row}>
          <Text>👤</Text>
          <Text style={styles.text}>{item.Type}</Text>
        </View>
  
        <View style={styles.row1}>
          <View style={styles.row}>
            <Text>🆔</Text>
            <Text style={styles.text}>User ID: {item.Userid}</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('WalletTopup', { userId: item.Userid,users: data })}>
              <Text style={styles.buttonText}>Wallet Topup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

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
        <Header headingTitle="Member List" />
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </SafeAreaView>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    justifyContent: "space-between",
  },
  text: {
    marginLeft: 8,
    fontSize: moderateScale(15),
    color: "purple",
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 9999,
    marginHorizontal: verticalScale(10),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalMessage: {
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 9999,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
