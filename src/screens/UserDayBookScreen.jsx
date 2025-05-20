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
  ActivityIndicator
} from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import Header from "../component/Header";
import GradientLayout from "../component/GradientLayout";
import ReportService from "../services/reportService";
import Constants from "expo-constants";
import { UserContext } from "../context/UserContext";

// Helper functions

export default function UserDayBookScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const UserDayBook = async () => {
      try {
        setLoading(true);
        const payload = {
            Tokenid: userData.tokenid,
            Version: Constants?.expoConfig?.version?.split(".")[0] || "1",
            Location: null,
        };

        const response = await ReportService.UserDayBook(
          payload.Tokenid,
          payload.Version,
          payload.Location
        );
        const data = response.data;
        console.log(data);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    UserDayBook(); // Fetch all on mount
  }, []);



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
    <Header headingTitle="User Day Book" />

    {/* 🟧 Summary Section */}
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Opening Balance:</Text>
        <Text style={styles.value}>₹{data?.Openingbalance || '0'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Received:</Text>
        <Text style={styles.value}>₹{data?.Receive || '0'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Transfer:</Text>
        <Text style={styles.value}>₹{data?.Transfer || '0'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Commission:</Text>
        <Text style={styles.value}>₹{data?.Commission || '0'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Request Amount:</Text>
        <Text style={styles.value}>₹{data?.ReqAmt || '0'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Current Balance:</Text>
        <Text style={[styles.value, { color: "#22c55e" }]}>₹{data?.Currentamount || '0'}</Text>
      </View>
    </View>

    {/* 🟦 Transactions Section */}
    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>Today’s Transactions</Text>
    {
      data?.TodayData?.length > 0 ? (
        <FlatList
          data={data.TodayData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Customize this as per the item structure */}
              <Text style={styles.label}>Txn ID: {item.TransactionID}</Text>
              <Text style={styles.label}>Amount: ₹{item.Amount}</Text>
              <Text style={styles.label}>Status: {item.Status}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
          No transactions found today.
        </Text>
      )
    }
  </SafeAreaView>
</GradientLayout>

  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    paddingVertical: 6,
    fontSize: 16,
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
    fontSize: 12,
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: "bold",
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
    color: "#444",
  },
  value: {
    fontWeight: "bold",
    color: "#000",
  },
  separator: {
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: "#ccc",
    marginVertical: 4,
  },
});
