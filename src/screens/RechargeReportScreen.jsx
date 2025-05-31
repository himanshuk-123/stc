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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { useSelector, useDispatch } from 'react-redux';

// Helper functions
const formatDate = (date) => {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const parseDate = (str) => {
  const [day, month, year] = str.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date) ? null : date;
};

const isValidDate = (dateStr) =>
  /^\d{2}-\d{2}-\d{4}$/.test(dateStr) && parseDate(dateStr) !== null;

export default function RechargeReport() {
  const [services, setServices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showPicker, setShowPicker] = useState({ from: false, to: false });
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  const payload = {
    Tokenid: userData.tokenid,
    Startdate: fromDate || "",
    status: null,
    Enddate: toDate || "",
    MobileNo: userData.mobilenumber,
    Version: Constants?.expoConfig?.version?.split(".")[0] || "1",
    Location: null,
  };

  useEffect(() => {
    
  const fetchTransactions = async (filtered = false) => {
    try {
      const response = await ReportService.RechargeReport(
        payload.Tokenid,
        payload.Startdate,
        payload.status,
        payload.Enddate,
        payload.MobileNo,
        payload.Version,
        payload.Location
      );
      const data = response.data;
        console.log(data)
      if (data.ERROR === "0") {
        const formattedData = data.REPORT.map((item, index) => ({
          id: index.toString(),
          RechargeID: item.RechargeID,
          FullName: item.FullName,
          MobileNO: item.MobileNO,
          Operator: item.Operator,
          OpTypeId: item.OpTypeId,
          images: item.images,
          Amount: item.Amount,
          Date: item.Date,
          Status: item.Status,
          OrignalOperatorId: item.OrignalOperatorId,
        }));
        setServices(formattedData);
      } else {
        console.log("Api Error: ", data.MESSAGE);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

    fetchTransactions(); // Fetch all on mount
  }, []);

  const handleDateChange = (event, selectedDate, type) => {
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      type === "from" ? setFromDate(formatted) : setToDate(formatted);
    }
    setShowPicker({ ...showPicker, [type]: false });
  };

  const handleInputChange = (text, type) => {
    const formatted = text.slice(0, 10);
    type === "from" ? setFromDate(formatted) : setToDate(formatted);
  };

  const onSearch = () => {
    if (isValidDate(fromDate) && isValidDate(toDate)) {
      fetchTransactions(true);
    } else {
      Alert.alert("Invalid Date Format", "Please use dd-mm-yyyy format.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>
          Transaction ID: {item.TranscationID}
        </Text>
      </View>

      <View style={styles.row}>
        <MaterialIcons name="date-range" size={20} />
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{item.Date}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Entypo name="info-with-circle" size={20} />
        <Text style={styles.label}>Type</Text>
        <Text style={styles.value}>{item.Type}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <FontAwesome5 name="wallet" size={18} />
        <Text style={styles.label}>Opening Balance</Text>
        <Text style={styles.value}>{item.OpeningBalance}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <FontAwesome5 name="money-check-alt" size={18} />
        <Text style={styles.label}>Closing Balance</Text>
        <Text style={styles.value}>{item.ClosingBalance}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Ionicons name="arrow-down-circle-outline" size={20} color="green" />
        <Text style={styles.label}>Credit Amount</Text>
        <Text style={styles.value}>{item.CreditAmount}</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.row}>
        <Ionicons name="arrow-up-circle-outline" size={20} color="red" />
        <Text style={styles.label}>Debit Amount</Text>
        <Text style={styles.value}>{item.DebitAmount}</Text>
      </View>
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView style={{ padding: 16 }}>
        <Header headingTitle="All Transaction Reports" />

        {/* Date Inputs */}
        <View style={styles.dateRow}>
          <View style={styles.dateInput}>
            <TouchableOpacity
              onPress={() => setShowPicker({ ...showPicker, from: true })}
            >
              <FontAwesome5 name="calendar" size={20} />
            </TouchableOpacity>
            <Text style={styles.dateLabel}>From</Text>
            <TextInput
              placeholder="dd-mm-yyyy"
              value={fromDate}
              onChangeText={(text) => handleInputChange(text, "from")}
              style={[
                styles.input,
                {
                  borderBottomColor: isValidDate(fromDate) ? "#ccc" : "red",
                  color: isValidDate(fromDate) ? "black" : "red",
                },
              ]}
              maxLength={10}
              keyboardType="numeric"
            />
            {showPicker.from && (
              <DateTimePicker
                value={parseDate(fromDate) || new Date()}
                mode="date"
                display="default"
                onChange={(e, d) => handleDateChange(e, d, "from")}
              />
            )}
          </View>

          <View style={styles.dateInput}>
            <TouchableOpacity
              onPress={() => setShowPicker({ ...showPicker, to: true })}
            >
              <FontAwesome5 name="calendar" size={20} />
            </TouchableOpacity>
            <Text style={styles.dateLabel}>To</Text>
            <TextInput
              placeholder="dd-mm-yyyy"
              value={toDate}
              onChangeText={(text) => handleInputChange(text, "to")}
              style={[
                styles.input,
                {
                  borderBottomColor: isValidDate(toDate) ? "#ccc" : "red",
                  color: isValidDate(toDate) ? "black" : "red",
                },
              ]}
              maxLength={10}
              keyboardType="numeric"
            />
            {showPicker.to && (
              <DateTimePicker
                value={parseDate(toDate) || new Date()}
                mode="date"
                display="default"
                onChange={(e, d) => handleDateChange(e, d, "to")}
              />
            )}
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        {/* List */}
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
