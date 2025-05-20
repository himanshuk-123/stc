import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { UserContext } from "../context/UserContext";
import Constants from "expo-constants";
import ReportService from "../services/reportService";
import Header from "../component/Header";
import GradientLayout from "../component/GradientLayout";

export default function FundRequestListScreen() {
  const [fundList, setFundList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchFundList = async () => {
      setLoading(true);
      try {
        const payload = {
          Tokenid: userData.tokenid,
          PageIndex: 1,
          PageSize: 20,
          Version: Constants?.expoConfig?.version?.split(".")[0] || "1",
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
        if (data.ERROR === "0") {
          setFundList(data.FUNDLIST);
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
        <Text style={styles.value}>{item.AddedDate}</Text>
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

  return (
    <GradientLayout>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
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
    color: "#555",
  },
  value: {
    color: "#000",
    flex: 1,
    textAlign: "right",
  },
  amount: {
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
  },
});
