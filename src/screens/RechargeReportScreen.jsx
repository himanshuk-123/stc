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
  Image,
  ActivityIndicator,
  Touchable
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {FontAwesome5,MaterialIcons,Entypo,Ionicons} from "@expo/vector-icons";
import Header from "../component/Header";
import GradientLayout from "../component/GradientLayout";
import ReportService from "../services/reportService";
import Constants from "expo-constants";
import { useSelector, useDispatch } from 'react-redux';
import { verticalScale } from "../utils/responsive";
import { useNavigation } from "@react-navigation/native";
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
  const [showDate, setShowDate] = useState(false);
  const [services, setServices] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState({ from: false, to: false });
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const navigation = useNavigation();
  const payload = {
    Tokenid: userData.tokenid,
    Startdate: null,
    status: null,
    Enddate: null,
    MobileNo: null,
    Version: Constants?.expoConfig?.version?.split(".")[0] || "1",
    Location: null,
  };

  useEffect(() => {
    console.log("Himanshu Kasoudhan: ",payload)
    setLoading(true);
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
        console.log("Response data: ", data)
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
    }finally{
      setLoading(false);
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
    <View key={item.id} style={{
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    }}>
      {/* Card Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
      }}>
        <View>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'blue', flexShrink: 1 }}>
          Recharge ID: {item.RechargeID}
        </Text>
         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <MaterialIcons name="date-range" size={16} color="black" />
        <Text style={{ marginLeft: 6, color: 'purple' }}>Date: {new Date(item.Date).toLocaleDateString()}</Text>
      </View>
        </View>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Image
          source={{ uri: `https://onlinerechargeservice.in/${item.images.replace(/^~\//, '')}` }}
          style={{ width: 40, height: 40, resizeMode: 'contain' }}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'green' }}>
          ₹ {item.Amount}
        </Text>
        </View>
      </View>

      {/* User Info */}
      <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 8, color: 'purple' }}>
        {item.FullName}
      </Text>

      {/* Mobile Number */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <MaterialIcons name="phone" size={16} color="green" />
        <Text style={{ marginLeft: 6, color: 'purple' }}>Mobile: {item.MobileNO}</Text>
      </View>

      {/* Operator */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <MaterialIcons name="sim-card" size={16} color="red" />
        <Text style={{ marginLeft: 6, color: 'purple' }}>Recharge of {item.Operator} Mobile</Text>
      </View>
      {/* Amount */}
      <View style={{
        marginTop: 12,
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{ 
          fontWeight: '600', 
          color: item.Status === 'Success' ? 'green' : 'red',
          backgroundColor: item.Status === 'Success' ? '#e0ffe0' : '#ffe0e0',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12
        }}>
          {item.Status}
        </Text>
        <TouchableOpacity style={{
          backgroundColor: 'green',padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center'}}
          onPress={() =>navigation.navigate('CompanyRecharge',{operator: item, mode: '1' })}
          >
          <Text style={{color: 'white'}}>Repeat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: '#4f46e5',padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>Print</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: 'red',padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center'}}
          onPress={() => navigation.navigate('BookComplain', { operator: item})}
          >
          <Text style={{color: 'white'}}>Complain</Text>
        </TouchableOpacity>
      </View>
        </View>
  );
  if(loading){
    return (
      <GradientLayout>
        <ActivityIndicator size="large" color="#0000ff" style={{flex:1, justifyContent:'center', alignItems:'center'}} />
      </GradientLayout>
    )
  }
  return (
    <GradientLayout>
      <SafeAreaView style={{ padding: 16 }}>
        <Header headingTitle="Recharge Report" />

        {/* Date Inputs */}
        {/* <TouchableOpacity
          onPress={() => setShowDate(!showDate)}
          style={{ padding: 8 }}
        >
        <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',gap:verticalScale(10)}}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'blue' }}>
          Filter by Date
        </Text>
        
        <FontAwesome5 name="filter" size={20} color="purple" />
        </View>
       
          <FontAwesome5 
            name="calendar" 
            size={20} 
            color={showDate ? '#3b82f6' : '#666'} 
          />
      </View>
        </TouchableOpacity> */}
        {showDate ? 
        (<View>
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
</View>
) : (
null
)}

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
