import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import GradientLayout from '../component/GradientLayout';
// import Header from '../component/Header';

const BrowsePlansScreen = () => {
  const [browsePlanData, setBrowsePlanData] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await axios.post(
          'https://onlinerechargeservice.in/App/webservice/BrowsePlan?OpCode=1&CircleID=21'
        );

        const data = response.data?.RDATA;
        if (!data) {
          console.error("RDATA not found in API response");
          return;
        }

        setBrowsePlanData(data);

        const grouped = groupPlansByType(data);
        setGroupedData(grouped);

        const types = Object.keys(grouped);
        const tabRoutes = types.map((type) => ({
          key: type,
          title: type,
        }));
        setRoutes(tabRoutes);
      } catch (error) {
        console.error('Error fetching plan data:', error);
      }
    };

    fetchPlanData();
  }, []);

  const renderScene = ({ route }) => {
    const plans = groupedData[route.key];

    if (!plans) return <Text>No data</Text>;

    return (
      <FlatList
        data={plans}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>
        )}
      />
    );
  };

  if (!browsePlanData || routes.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={{ marginTop: 10 }}>Loading Plans...</Text>
      </View>
    );
  }

  return (
    <GradientLayout style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16 }}>
        {/* <Header headingTitle="Browse Plans" /> */}
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Browse Plans</Text>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: 'blue' }}
            style={{ backgroundColor: 'white' }}
            labelStyle={{ fontWeight: 'bold' }}
            activeColor="blue"
            inactiveColor="gray"
            renderLabel={({ route, focused }) => (
              <Text
                style={{
                  color: focused ? 'blue' : 'gray',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                {route.title.charAt(0).toUpperCase() + route.title.slice(1)}
              </Text>
            )}
          />
        )}
      />
    </SafeAreaView>
     </GradientLayout>
  );
};

export default BrowsePlansScreen;

// Grouping function
const groupPlansByType = (data) => {
  const grouped = {};

  const types = data?.type || [];
  const vals = data?.val || [];
  const descs = data?.des || [];
  const amts = data?.am || [];

  types.forEach((type, index) => {
    if (!grouped[type]) grouped[type] = [];

    grouped[type].push({
      title: vals[index] || '',
      description: descs[index] || '',
      price: amts[index] || '',
    });
  });

  return grouped;
};

// Styles
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 4,
    color: 'green',
    fontWeight: '600',
  },
});
