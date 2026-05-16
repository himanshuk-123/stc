import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import { moderateScale, verticalScale, horizontalScale } from '../utils/responsive';

export default function DistributerFundScreen() {
  const userData = useSelector((state) => state.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        Tokenid: userData.tokenid,
        Version: '1',
        Location: null,
      };

      const res = await fetch('https://onlinerechargeservice.in/App/webservice/WalletRequestTOme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data && data.ERROR === '0') {
        setItems(data.Details || []);
      } else {
        setError(data.MESSAGE || 'Failed to load');
      }
    } catch (err) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <Text style={styles.name}>{item.FullName}</Text>
        <Text style={styles.amount}>₹ {Number(item.Amount).toFixed(2)}</Text>
      </View>

      <View style={styles.row}> 
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{item.AmountType}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{item.Status}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Txn ID:</Text>
        <Text style={styles.value}>{item.chequeno}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{item.Addeddate}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <GradientLayout>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      </GradientLayout>
    );
  }

  return (
    <GradientLayout>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Header headingTitle="Distributer Fund" />

        {error ? (
          <View style={{ padding: 16 }}>
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.Id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </SafeAreaView>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1E88E5',
  },
  amount: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#0F766E',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontWeight: '700',
    marginRight: 8,
    color: '#374151',
    width: 90,
  },
  value: {
    color: '#374151',
    flex: 1,
  },
});
