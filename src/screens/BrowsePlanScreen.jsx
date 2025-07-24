import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Header from '../component/Header';
import { verticalScale } from '../utils/responsive';
import GradientLayout from '../component/GradientLayout';
import { useNavigation } from '@react-navigation/native';

const BrowsePlansScreen = ({ route }) => {
  const { opcodenew, stateId, mode, operator, number } = route.params;
  const [browsePlanData, setBrowsePlanData] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchPlanData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://onlinerechargeservice.in/App/webservice/BrowsePlan2?OpCode=${opcodenew}&CircleID=${stateId}`,
        { method: 'POST' }
      );

      const json = await response.json();
      const data = json?.RDATA;

      if (json?.STATUS != '1') {
        Alert.alert("Error", json?.MESSAGE, [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
        return;
      }

      setBrowsePlanData(data);
      const grouped = groupPlansByType(data || []);
      setGroupedData(grouped);

      const types = prioritizeTabs(Object.keys(grouped));
      if (!selectedType || !types.includes(selectedType)) {
        setSelectedType(types[0] || '');
      }
    } catch (error) {
      console.error('Error fetching plan data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlanData();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tabItem,
        { backgroundColor: item === selectedType ? 'blue' : '#ffffff' },
      ]}
      onPress={() => setSelectedType(item)}
    >
      <Text style={{ color: item === selectedType ? '#fff' : '#000', fontWeight: '600' }}>
        {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
      </Text>
    </TouchableOpacity>
  );

  const renderPlanCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        setSelectedPlan(selectedPlan?.id === item.id ? null : item);
        navigation.replace('CompanyRecharge', {
          operator,
          mode,
          opcodenew,
          price: item.price,
          number,
        });
      }}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: selectedPlan?.id === item.id ? '#6c5ce7' : '#f1f2f6',
            borderWidth: selectedPlan?.id === item.id ? 1.5 : 1,
            elevation: selectedPlan?.id === item.id ? 5 : 2,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.validityText}>₹{item.price}</Text>
          <Text style={styles.detailText}>
            {item.data ? `📶 ${item.data}` : ''}
            {item.data && item.calls ? ' | ' : ''}
            {item.calls ? `📞 ${item.calls}` : ''}
            {(item.calls || item.data) && item.sms ? ' | ' : ''}
            {item.sms ? `✉️ ${item.sms}` : ''}
          </Text>
        </View>

        <View>
          <Text style={{ fontSize: 12, color: 'black', fontWeight: 'bold' }}>({item.validityDays} days)</Text>
          <Text style={styles.perDay}>@ ₹{item.dailyCost}/D</Text>
          <View style={{ marginTop: 5 }}>
            <Text style={styles.benefitText}>{item.benefit}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <GradientLayout>
        <SafeAreaView style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      </GradientLayout>
    );
  }

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <Header headingTitle="Browse Plans" />

        <View style={styles.tabsContainer}>
          <FlatList
            horizontal
            data={prioritizeTabs(Object.keys(groupedData))}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <FlatList
          data={groupedData[selectedType] || []}
          renderItem={renderPlanCard}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const groupPlansByType = (data) => {
  const grouped = {};
  data?.forEach((category) => {
    const type = category?.name?.toLowerCase();
    if (!type) return;

    grouped[type] = category?.plans?.map((plan) => {
      return {
        id: plan?.id,
        price: plan?.amount || '',
        validity: plan?.validity || '',
        benefit: plan?.benefit || '',
        sms: plan?.sms || '',
        data: plan?.data || '',
        calls: plan?.calls || '',
        validityDays: plan?.validityDays || '',
        dailyCost: plan?.dailyCost || '',
      };
    }) || [];
  });
  return grouped;
};

const prioritizeTabs = (tabs) => {
  const priority = ['unlimited', 'data'];
  const lowerTabs = tabs.map((tab) => tab.toLowerCase());
  const prioritizedTabs = [];
  priority.forEach((p) => {
    const index = lowerTabs.indexOf(p);
    if (index !== -1) prioritizedTabs.push(tabs[index]);
  });
  const remainingTabs = tabs.filter(tab => !priority.includes(tab.toLowerCase()));
  return [...prioritizedTabs, ...remainingTabs];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: verticalScale(10),
    paddingVertical: verticalScale(10),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: 'purple',
    borderBottomWidth: 1,
    borderBottomColor: 'purple',
    paddingVertical: verticalScale(8),
  },
  tabItem: {
    paddingHorizontal: 20,
    height: 36,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  validityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    // borderRightWidth:1,
    borderColor:'#000',
    paddingRight:10,
  
  },
  perDay: {
    fontSize: 12,
    color: 'green',
  },
  cardDetails: {
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    flexWrap:'wrap',
    flex:1,
  },
  benefitText: {
    fontSize: 14,
    color: 'purple',
  },
});

export default BrowsePlansScreen;