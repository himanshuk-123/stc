import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import { horizontalScale, verticalScale } from '../utils/responsive';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const PrintReportScreen = ({ route }) => {
  const { operator } = route.params;
  const [loading, setLoading] = useState(false);

  const dummyData = {
    name: operator.FullName,
    receiptNo: operator.ReceiptNo,
    date: operator.Date,
    number: operator.MobileNO,
    operator: operator.Operator,
    amount: operator.Amount,
    operatorId: operator.OrignalOperatorId,
  };

  const handleGenerateAndSharePDF = async () => {
    setLoading(true);
    try {
      const htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            .logo { width: 100px; margin-bottom: 10px; }
            .box, .table { border: 1px solid #333; padding: 12px; margin-bottom: 10px; }
            .row { display: flex; border-bottom: 1px solid #ccc; }
            .cell { flex: 1; padding: 8px; text-align: center; border-right: 1px solid #ccc; }
            .title { font-weight: bold; color: blue; margin-top: 10px; }
            .terms { font-size: 11px; margin-bottom: 4px; }
            .center { text-align: center; }
            .logo { width: 100px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto; }
          </style>
        </head>
        <body>
          <h2 class="center">Recharge Report</h2>
          <div class="box">
            <img src="https://onlinerechargeservice.in/Content/assets/img/logo.png" class="logo" />
            <p>Name: ${dummyData.name}</p>
            <p>Phone: ${dummyData.number}</p>
          </div>

          <p><strong>Receipt No:</strong> ${dummyData.receiptNo} &nbsp;&nbsp; <strong>Date:</strong> ${dummyData.date}</p>

          <div class="table">
            <div class="row">
              <div class="cell">Number</div>
              <div class="cell">Operator</div>
              <div class="cell">Amount</div>
            </div>
            <div class="row">
              <div class="cell">${dummyData.number}</div>
              <div class="cell">${dummyData.operator}</div>
              <div class="cell">${dummyData.amount}.00</div>
            </div>
            <div class="row">
              <div class="cell">Grand Total</div>
              <div class="cell"></div>
              <div class="cell">${dummyData.amount}.00</div>
            </div>
          </div>

          <p><strong>Operator ID:</strong> ${dummyData.operatorId}</p>
          <p><strong>Received Amount:</strong> ₹${dummyData.amount}</p>

          <p class="center" style="font-size:10px; margin-top: 10px;">
            (This is a Computer generated receipt and requires no signature)
          </p>

          <p class="title">Terms And Condition</p>
          <p class="terms">
            Please note: Dear Customer the bill transfer will reflect in the next 7 working days or billing cycle.
          </p>

          <p class="title">Declaration</p>
          <p class="terms">This is not an invoice but only a confirmation of the amount paid against for the service above.</p>
          <p class="terms">This is a Computer generated receipt and only valid at STC Counter.</p>
        </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: 'Recharge_Report',
        base64: false,
      };

      const file = await RNHTMLtoPDF.convert(options);

      await Share.open({
        url: `file://${file.filePath}`,
        type: 'application/pdf',
        failOnCancel: false,
      });
    } catch (error) {
      console.error('PDF Share Error:', error);
      Alert.alert('Error', 'Failed to generate or share PDF.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(operator);
  }, [operator]);

  return (
    <GradientLayout>
      <ScrollView style={styles.container}>
        <Header headingTitle="Recharge Report" />

        <View style={styles.box}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <View>
            <Text style={styles.txt}>Name: {dummyData.name}</Text>
            <Text style={styles.txt}>Phone: {dummyData.number}</Text>
          </View>
        </View>

        <Text style={styles.receiptText}>
          Receipt No : {dummyData.receiptNo}   Date: {dummyData.date}
        </Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}>Number</Text>
            <Text style={styles.cell}>Operator</Text>
            <Text style={styles.cell}>Amount</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>{dummyData.number}</Text>
            <Text style={styles.cell}>{dummyData.operator}</Text>
            <Text style={styles.cell}>{dummyData.amount}.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Grand Total</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{dummyData.amount}.00</Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.bold}>Operator ID: {dummyData.operatorId}</Text>
          <Text style={styles.bold}>Received Amount: ₹{dummyData.amount}</Text>
        </View>

        <Text style={styles.termsTitle}>Terms and Conditions</Text>
        <Text style={styles.terms}>
          Please note: Dear Customer the bill transfer will reflect in the next 7 working days or billing cycle.
        </Text>

        <Text style={styles.termsTitle}>Declaration</Text>
        <Text style={styles.terms}>
          This is not an invoice but a confirmation of the amount paid for the service above.
        </Text>
        <Text style={styles.terms}>
          This is a computer-generated receipt and only valid at STC counter.
        </Text>

        <TouchableOpacity style={styles.printButton} onPress={handleGenerateAndSharePDF} disabled={loading}>
          <Text style={styles.printText}>{loading ? <ActivityIndicator color="#fff" /> : 'Download / Share PDF'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </GradientLayout>
  );
};

export default PrintReportScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14 },
  box: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 10,
    marginTop: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: horizontalScale(80),
    height: verticalScale(50),
    marginRight: 10,
    resizeMode: 'contain',
  },
  receiptText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  table: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'blue',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: 'blue',
    color: 'black'
  },
  txt:{
    color: 'black'
  },
  details: {
    marginTop: 10,
  },
  termsTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  terms: {
    fontSize: 11,
    marginVertical: 4,
    fontWeight: 'bold',
    color: '#5a5e5b',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  printButton: {
    marginTop: 20,
    backgroundColor: '#d90459',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
