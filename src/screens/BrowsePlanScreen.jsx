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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import { verticalScale } from '../utils/responsive';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, BORDERS, SHADOWS } from '../utils/theme';

// Import assets
import wifi from '../../assets/wifi.png';
import phone from '../../assets/phone_icon.png';
import sms from '../../assets/sms.png';
const BrowsePlansScreen = ({ route }) => {
  const { opcodenew, stateId, mode, operator, number } = route.params;
  const [planData, setPlanData] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  /**
   * Fetches plan data from API
   */
  const fetchPlanData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://onlinerechargeservice.in/App/webservice/BrowsePlan2?OpCode=${opcodenew}&CircleID=${stateId}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const json = await response.json();
      const data = json?.RDATA;

      if (json?.STATUS !== '1') {
        const errorMessage = json?.MESSAGE || 'Failed to fetch plan data';
        Alert.alert("Error", errorMessage, [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
        throw new Error(errorMessage);
      }

      setPlanData(data);
      const grouped = groupPlansByType(data || []);
      setGroupedData(grouped);

      const types = prioritizeTabs(Object.keys(grouped));
      if (!selectedType || !types.includes(selectedType)) {
        setSelectedType(types[0] || '');
      }
    } catch (err) {
      console.error('Error fetching plan data:', err);
      setError(err.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const getData = async () => {
      await fetchPlanData();
    };
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opcodenew, stateId]); // Re-fetch when key parameters change

  /**
   * Handle refresh action
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchPlanData();
  };

  /**
   * Render a tab item for plan types
   */
  const renderTabItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tabItem,
        { 
          backgroundColor: item === selectedType ? COLORS.secondary : COLORS.card 
        }
      ]}
      onPress={() => setSelectedType(item)}
    >
      <Text 
        style={{ 
          color: item === selectedType ? COLORS.textSecondary : COLORS.text,
          fontWeight: FONT_WEIGHTS.semiBold
        }}
      >
        {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
      </Text>
    </TouchableOpacity>
  );

  /**
   * Render a feature icon with text
   */
  const renderFeatureItem = (feature, icon) => {
    if (!feature) return null;
    
    return (
      <View style={styles.detailBox}>
        <Image source={icon} style={styles.featureIcon} />
        <Text style={styles.detailItem}>{feature}</Text>
      </View>
    );
  };

  /**
   * Render a plan card
   */
  const renderPlanCard = ({ item }) => {
    const isPlanSelected = selectedPlan?.id === item.id;
    const cardStyle = {
      borderColor: isPlanSelected ? COLORS.primary : COLORS.border,
      borderWidth: isPlanSelected ? BORDERS.width.thick : BORDERS.width.regular,
      elevation: isPlanSelected ? 5 : 2
    };
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setSelectedPlan(isPlanSelected ? null : item);
          navigation.replace('CompanyRecharge', {
            operator,
            mode,
            opcodenew,
            price: item.price,
            number,
            headingTitle: "Mobile Recharge"
          });
        }}
      >
        <View style={[styles.card, cardStyle]}>
          <View style={styles.cardHeader}>
            <Text style={styles.priceText}>₹{item.price}</Text>
            <Text style={styles.validityDays}>({item.validityDays} days)</Text>
            <Text style={styles.perDay}>@ ₹{item.dailyCost}/D</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.featuresContainer}>
              {renderFeatureItem(item.data, wifi)}
              {renderFeatureItem(item.calls, phone)}
              {renderFeatureItem(item.sms, sms)}
            </View>

            <View>
              <Text style={styles.benefitText}>{item.benefit}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <GradientLayout>
        <SafeAreaView style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
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
            renderItem={renderTabItem}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <FlatList
          data={groupedData[selectedType] || []}
          renderItem={renderPlanCard}
          keyExtractor={(item, index) => `${item.id || ''}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.plansList}
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
    backgroundColor: COLORS.card,
    borderTopWidth: BORDERS.width.regular,
    borderTopColor: COLORS.accent,
    borderBottomWidth: BORDERS.width.regular,
    borderBottomColor: COLORS.accent,
    paddingVertical: verticalScale(8),
  },
  tabItem: {
    paddingHorizontal: 15,
    height: 36,
    marginRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDERS.radius.lg,
  },
  plansList: {
    paddingBottom: 130,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: BORDERS.radius.md,
    marginBottom: 15,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingRight: 10,
  },
  priceText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    paddingRight: 10,
    marginBottom: 5,
  },
  validityDays: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.bold,
  },
  perDay: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 5,
    borderLeftWidth: BORDERS.width.regular,
    borderColor: COLORS.borderDark,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 10,
    rowGap: 8,
    columnGap: 10,
  },
  detailBox: {
    flexShrink: 1,
    maxWidth: '30%',
    minWidth: '30%',
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  detailItem: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.accent,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  benefitText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
});

export default BrowsePlansScreen;