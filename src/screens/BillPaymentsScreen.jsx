import { View, Text, SafeAreaView, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import RechargeApiServices from '../services/RechargeService';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';

const BillPaymentsScreen = ({ route }) => {
  const { mode, headingTitle } = route.params;
  const userData = useSelector(state => state.user);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigation = useNavigation()

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const token = userData.tokenid;
      const payload = {
        Tokenid: token,
        mode: mode,
        Version: '1',
        Location: null,
      };

      const response = await RechargeApiServices.operator(
        payload.Tokenid,
        payload.mode,
        payload.Version,
        payload.Location
      );

      const data = response.data;

      if (data.ERROR === '11') {
        setShowErrorModal(true);
        setErrorMessage("Authentication failed");
      } else if (data.ERROR === '0') {
        const formattedData = data.Operator.map((item, index) => ({
          id: index.toString(),
          opcodenew: item.opcodenew,
          name: item.operatorname,
          image: IMAGE_BASE_URL + item.operator_img.replace(/^~\//, ''),
        }));
        setServices(formattedData);
        setFilteredServices(formattedData); // Show all initially
      } else {
        console.log('API Error himanshu:', data.MESSAGE);
      }
    } catch (error) {
      console.log('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  // ✅ Search filter
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = services.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('CompanyRecharge', {operator: item, mode: mode, opcodenew: item.opcodenew ,headingTitle:item.name ,screenName:"BillPaymentsScreen" })
      }
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: horizontalScale(40),
          height: verticalScale(40),
          marginRight: 12,
          borderRadius: 6,
        }}
        resizeMode="contain"
      />
      <View style={{width:'90%'}}>
      <Text style={{ fontSize: moderateScale(15), color: '#333', fontWeight: '500' }}>
        {item.name}
      </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientLayout>
      <SafeAreaView
        style={{
          paddingHorizontal: horizontalScale(16),
          paddingTop: verticalScale(16),
          flex: 1,
        }}
      >
        {/* Back Button and Title */}
        <Header headingTitle={headingTitle} />

        {/* Search Bar */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 999,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: horizontalScale(16),
            marginBottom: verticalScale(16),
            height: verticalScale(40),
          }}
        >
          <TextInput
            placeholder="Search Operators"
            value={searchText}
            onChangeText={handleSearch}
            style={{
              flex: 1,
              paddingVertical: verticalScale(8),
              color: '#333',
              fontWeight: 'bold',
              fontSize: moderateScale(16),
            }}
            placeholderTextColor="#888"
          />
        </View>
        {/* Operator List */}
        {loading ? (
          <ActivityIndicator size="large" color="#00f2fe" />
        ) : (
          <FlatList
            data={filteredServices}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}

      </SafeAreaView>
    </GradientLayout>
  );
};

export default BillPaymentsScreen;
