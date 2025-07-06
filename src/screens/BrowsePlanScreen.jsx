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
        `https://onlinerechargeservice.in/App/webservice/BrowsePlan?OpCode=${opcodenew}&CircleID=${stateId}`,
        { method: 'POST' }
      );

      const json = await response.json();
      const data = json?.RDATA;
      console.log(json);
      if (json?.STATUS != '1') {
        Alert.alert("Error", json?.MESSAGE,
          [
            {
              text: "OK",
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
        return;
      }

      setBrowsePlanData(data);
      const grouped = groupPlansByType(data);
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
      style={{
        backgroundColor: item === selectedType ? 'blue' : '#ffffff',
        paddingHorizontal: 20,
        height: 36,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
      }}
      onPress={() => setSelectedType(item)}
    >
      <Text
        style={{
          color: item === selectedType ? '#fff' : '#000000',
          fontWeight: '600',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
      </Text>
    </TouchableOpacity>
  );

  const renderPlanCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        setSelectedPlan(selectedPlan?.title === item.title ? null : item);
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
        style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 15,
          marginBottom: 15,
          elevation: selectedPlan?.title === item.title ? 5 : 2,
          borderColor:
            selectedPlan?.title === item.title ? '#6c5ce7' : '#f1f2f6',
          borderWidth: selectedPlan?.title === item.title ? 1.5 : 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'blue',
              flex: 1,
            }}
          >
            {item.title}
          </Text>
          <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'green',
              }}
            >
              ₹{item.price}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 14, color: 'purple', lineHeight: 20 }}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <GradientLayout>
        <SafeAreaView
          style={{
            flex: 1,
            paddingHorizontal: verticalScale(10),
            paddingVertical: verticalScale(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      </GradientLayout>
    );
  }

  return (
    <GradientLayout>
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: verticalScale(10),
          paddingVertical: verticalScale(10),
        }}
      >
        <Header headingTitle="Browse Plans" />
        {/* Tabs */}
        <View
          style={{
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: 'purple',
            borderBottomWidth: 1,
            borderBottomColor: 'purple',
            paddingVertical: verticalScale(8),
          }}
        >
          <FlatList
            horizontal
            data={prioritizeTabs(Object.keys(groupedData))}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Plan Cards */}
        <View style={{ paddingTop: verticalScale(10) }}>
          <FlatList
            data={groupedData[selectedType] || []}
            renderItem={renderPlanCard}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 130 }}
          />
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};

const groupPlansByType = (data) => {
  const grouped = {};
  const types = data?.type || [];
  const vals = data?.val || [];
  const descs = data?.des || [];
  const amts = data?.am || [];

  types.forEach((type, index) => {
    if (!grouped[type]) grouped[type] = [];

    const description = descs[index] || '';
    let validity = '';
    const validityMatch =
      description.match(/\d+\s*day(s)?/i) ||
      description.match(/\d+\s*month(s)?/i);
    if (validityMatch) validity = validityMatch[0];

    grouped[type].push({
      title: vals[index] || '',
      description,
      price: amts[index] || '',
      validity,
    });
  });

  return grouped;
};

const prioritizeTabs = (tabs) => {
  const priority = ['unlimited','data'];

  const lowerTabs = tabs.map((tab) => tab.toLowerCase());

  const prioritizedTabs = [];

  // First: Add prioritized tabs (preserve original casing)
  priority.forEach((p) => {
    const index = lowerTabs.indexOf(p);
    if (index !== -1) {
      prioritizedTabs.push(tabs[index]); // push original tab
    }
  });

  // Second: Add remaining tabs (excluding prioritized ones)
  const remainingTabs = tabs.filter(
    (tab) => !priority.includes(tab.toLowerCase())
  );

  return [...prioritizedTabs, ...remainingTabs];
};


export default BrowsePlansScreen;
