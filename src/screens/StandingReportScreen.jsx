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

export default function StandingReportScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const StandingReport = async () => {
      try {
        setLoading(true);
        const payload = {
            Tokenid: userData.tokenid,
            PageIndex: 0,
            PageSize: 20,
            Version: Constants?.expoConfig?.version?.split(".")[0] || "1",
            Location: null,
        };

        const response = await ReportService.StandingReport(
          payload.Tokenid,
          payload.PageIndex,
          payload.PageSize,
          payload.Version,
          payload.Location
        );
        const data = response.data;
        console.log(data);
        // if (data.ERROR === "0") {
        //   const formattedData = data.REPORT.map((item, index) => ({
        //     id: index.toString(),
        //     TranscationID: item.TranscationID,
        //     Date: item.Date,
        //     Type: item.Type,
        //     OpeningBalance: item.OpneningBalance || item.OpeninigBalance,
        //     ClosingBalance: item.ClosingAmount,
        //     CreditAmount: item.CreditAmount,
        //     DebitAmount: item.DebitAmount,
        //   }));
        //   setServices(formattedData);
        // } else {
        //   console.log("Api Error: ", data.MESSAGE);
        // }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    StandingReport(); // Fetch all on mount
  }, []);

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.cardHeaderText}>
//           Transaction ID: {item.TranscationID}
//         </Text>
//       </View>

//       <View style={styles.row}>
//         <MaterialIcons name="date-range" size={20} />
//         <Text style={styles.label}>Date</Text>
//         <Text style={styles.value}>{item.Date}</Text>
//       </View>
//       <View style={styles.separator} />

//       <View style={styles.row}>
//         <Entypo name="info-with-circle" size={20} />
//         <Text style={styles.label}>Type</Text>
//         <Text style={styles.value}>{item.Type}</Text>
//       </View>
//       <View style={styles.separator} />

//       <View style={styles.row}>
//         <FontAwesome5 name="wallet" size={18} />
//         <Text style={styles.label}>Opening Balance</Text>
//         <Text style={styles.value}>{item.OpeningBalance}</Text>
//       </View>
//       <View style={styles.separator} />

//       <View style={styles.row}>
//         <FontAwesome5 name="money-check-alt" size={18} />
//         <Text style={styles.label}>Closing Balance</Text>
//         <Text style={styles.value}>{item.ClosingBalance}</Text>
//       </View>
//       <View style={styles.separator} />

//       <View style={styles.row}>
//         <Ionicons name="arrow-down-circle-outline" size={20} color="green" />
//         <Text style={styles.label}>Credit Amount</Text>
//         <Text style={styles.value}>{item.CreditAmount}</Text>
//       </View>
//       <View style={styles.separator} />

//       <View style={styles.row}>
//         <Ionicons name="arrow-up-circle-outline" size={20} color="red" />
//         <Text style={styles.label}>Debit Amount</Text>
//         <Text style={styles.value}>{item.DebitAmount}</Text>
//       </View>
//     </View>
//   );

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
        <Header headingTitle="All Transaction Reports" />
        {/* <FlatList
          data={services}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        /> */}
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
