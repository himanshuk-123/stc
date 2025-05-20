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
// import {
//   FontAwesome5,
//   MaterialIcons,
//   Entypo,
//   Ionicons,
// } from "@expo/vector-icons";
import Header from "../component/Header";
import GradientLayout from "../component/GradientLayout";
import ReportService from "../services/reportService";
import Constants from "expo-constants";
import { UserContext } from "../context/UserContext";
import { FontAwesome5, MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
// Helper functions

export default function MemberListScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const MemberList = async () => {
      setLoading(true);
      try {
        const payload = {
            Tokenid: userData.tokenid,
            Version: Constants?.expoConfig?.version?.split(".")[0] || "1",
            Location: null,
        };

        const response = await ReportService.MEMBERLIST(
          payload.Tokenid,
          payload.Version,
          payload.Location
        );
        const data = response.data;
        setData(data.MEMBERLIST);
        console.log(data);
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
          <Ionicons name="call" size={16} color="#4CAF50" />
          <Text style={styles.text}>{item.MobileNumber}</Text>
        </View>
  
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={16} color="#E91E63" />
          <Text style={styles.text}>{item.Address || "N/A"}</Text>
        </View>
  
        <View style={styles.row}>
          <Entypo name="user" size={16} color="#607D8B" />
          <Text style={styles.text}>{item.Type}</Text>
        </View>
  
        <View style={styles.row}>
          <FontAwesome5 name="id-badge" size={16} color="#9C27B0" />
          <Text style={styles.text}>User ID: {item.Userid}</Text>
        </View>
      </View>
    );
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
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: "#444",
  },
});
