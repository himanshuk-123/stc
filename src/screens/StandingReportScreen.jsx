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
    ActivityIndicator
  } from "react-native";
  import Header from "../component/Header";
  import GradientLayout from "../component/GradientLayout";
  import ReportService from "../services/reportService";
  // import Constants from "expo-constants";
  import { useSelector, useDispatch } from 'react-redux';
import { moderateScale } from "../utils/responsive";

  // Helper functions

  export default function StandingReportScreen() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const [transactions, setTransactions] = useState([]); 
    useEffect(() => {
      const StandingReport = async () => {
        try {
          setLoading(true);
          const payload = {
              Tokenid: userData.tokenid,
              PageIndex: 1,
              PageSize: 20,
              Version: "1",
              Location: userData.location,
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
          setTransactions(data.REPORT);

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


  const TransactionCard = ({ item }) => {
    const date = new Date(item.Date).toLocaleString();
    const isCredit = item.AmtTypeName === 'Credit';
    const amount = item.CreditAmount || item.DebitAmount;
  
    return (
      <View style={[
        styles.card, 
        isCredit ? styles.credit : styles.debit,
        styles.cardShadow
      ]}>
        <View style={styles.headerRow}>
          <Text style={[
            styles.typeText,
            isCredit ? styles.creditText : styles.debitText
          ]}>
            {item.AmtTypeName}
          </Text>
          <Text style={styles.dateText}>{date}</Text> 
        </View>
  
        <View style={styles.amountRow}>
          <Text style={[
            styles.amount,
            isCredit ? styles.creditAmount : styles.debitAmount
          ]}>
            {isCredit ? '+' : '-'}₹{amount}
          </Text>
          <Text style={styles.typeName}>{item.TypeName}</Text>
        </View>
  
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Opening:</Text>
            <Text style={styles.balanceValue}>₹{item.OpneningBalance}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Closing:</Text>
            <Text style={styles.balanceValue}>₹{item.ClosingAmount}</Text>
          </View>
        </View>
  
        <View style={styles.footerRow}>
                   
            <Text style={styles.remarkLabel}>Remark:</Text>
            <Text style={styles.remarkText} numberOfLines={1}>
              {item.Remark}
            </Text>
        </View>
        <View style={styles.footerRow}>
                   
            <Text style={styles.remarkLabel}>Added By:</Text>
            <Text style={styles.remarkText} numberOfLines={1}>
              {item.AddedByID}
            </Text>
        </View>
      </View>
    );
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
          <Header headingTitle="Standing Report" />
          <FlatList
      data={transactions}
      keyExtractor={(item) => item.TranscationID.toString()}
      renderItem={({ item }) => <TransactionCard item={item} />}
      contentContainerStyle={{paddingBottom: 80}}
    />
        </SafeAreaView>
      </GradientLayout>
    );
  }


  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      overflow: 'hidden',
    },
    cardShadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    credit: {
      borderLeftWidth: 3,
      borderLeftColor: '#4CAF50',
    },
    debit: {
      borderLeftWidth: 3,
      borderLeftColor: '#F44336',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    typeText: {
      fontSize: moderateScale(12),
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    creditText: {
      color: '#4CAF50',
    },
    debitText: {
      color: '#F44336',
    },
    transactionId: {
      fontSize: 11,
      color: '#757575',
    },
    amountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    amount: {
      fontSize: moderateScale(18),
      fontWeight: '800',
    },
    creditAmount: {
      color: '#4CAF50',
    },
    debitAmount: {
      color: '#F44336',
    },
    typeName: {
      fontSize: moderateScale(12),
      color: '#616161',
      fontWeight: '500',
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
      paddingVertical: 6,
      borderTopWidth: 0.5,
      borderColor: '#f0f0f0',
    },
    balanceItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    balanceLabel: {
      color: '#757575',
      fontSize: moderateScale(11),
      marginRight: 4,
      fontWeight: '500',
    },
    balanceValue: {
      color: '#424242',
      fontSize: moderateScale(12),
      fontWeight: '600',
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 0.5,
      borderColor: '#f0f0f0',
      paddingVertical: 6,
    },
    dateText: {
      fontSize: moderateScale(11),
      color: '#757575',
    },
    remarkLabel: {
      fontSize: moderateScale(11),
      color: '#616161',
      fontWeight: '500',
    },
    remarkText: {
      fontSize: moderateScale(11),
      color: '#616161',
      fontStyle: 'italic',
      maxWidth: '50%',
    },
  });