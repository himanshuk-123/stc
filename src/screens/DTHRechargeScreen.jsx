import React, { useEffect, useState } from 'react';
import { 
  View, 
  SafeAreaView, 
  FlatList, 
  ActivityIndicator, 
  Text, 
  StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

// Components
import Header from '../component/Header';
import Cards from '../component/cards';
import GradientLayout from '../component/GradientLayout';
import ErrorModal from '../component/ErrorModal';

// Services
import RechargeApiServices from '../services/RechargeService';

// Utils
import { logout } from '../utils/authUtils';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';

// Constants
import { COLORS } from '../constants/colors';

const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';
const MODE = '2'; // DTH mode

/**
 * DTHRechargeScreen - Displays a list of DTH operators for recharge
 */
const DTHRechargeScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const cardWidth = "90%";
  const cardHeight = verticalScale(80);

  useEffect(() => {
    fetchOperators();
  }, []);

  /**
   * Fetches DTH operators from the API
   */
  const fetchOperators = async () => {
    try {
      setLoading(true);
      const token = userData.tokenid;
      
      const payload = {
        Tokenid: token,
        mode: MODE,
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
      
      if (data.STATUSCODE !== '1') {
        setShowErrorModal(true);
        setErrorMessage(data.MESSAGE);
        return;
      }
      
      if (data.ERROR === '0') {
        const formattedData = data.Operator.map((item, index) => ({
          id: index.toString(),
          name: item.operatorname,
          image: IMAGE_BASE_URL + item.operator_img.replace(/^~\//, ''),
          opcodenew: item.opcodenew,
        }));

        setServices(formattedData);
      } else {
        console.log('API Error:', data.MESSAGE);
        setErrorMessage(data.MESSAGE || 'Failed to fetch operators');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.log('API Error:', error);
      setErrorMessage('Network error. Please try again.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders a single DTH operator card
   */
  const renderItem = ({ item }) => {
    if (!item || !item.image || !item.name) {
      return null; // Don't render if item or required properties are missing
    }
    
    return (
      <View style={styles.cardContainer}>
        <Cards
          imageSource={{ uri: item.image }}
          title={item.name}
          height={cardHeight}
          width={cardWidth}
          imgheight={50}
          imgwidth={50}
          gradientColors={[COLORS.card, COLORS.card]}
          style={styles.cardTitle}
          onPress={() => handleOperatorPress(item)}
          cardsPerRow={3}
        />
      </View>
    );
  };

  /**
   * Handles operator card press
   */
  const handleOperatorPress = (operator) => {
    navigation.navigate('CompanyRecharge', { 
      operator,
      mode: MODE,
      opcodenew: operator.opcodenew,
      headingTitle: "DTH Recharge",
      screenName: "DTHRechargeScreen" 
    });
  };

  /**
   * Handles error modal OK button press
   */
  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function if token expired
    logout();
  };

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <ErrorModal
          visible={showErrorModal}
          message={errorMessage}
          onClose={handleErrorModalOk}
        />
        
        <Header headingTitle="DTH Recharge" />
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : services.length > 0 ? (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noServicesContainer}>
            <Text style={styles.noServicesText}>No DTH services available</Text>
          </View>
        )}
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16)
  },
  loader: {
    marginTop: verticalScale(20)
  },
  cardContainer: {
    width: '33%',
    alignItems: 'center',
    marginVertical: verticalScale(8)
  },
  cardTitle: {
    fontSize: moderateScale(12)
  },
  listContainer: {
    paddingBottom: verticalScale(100)
  },
  noServicesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(40)
  },
  noServicesText: {
    fontSize: moderateScale(18),
    color: COLORS.textLight
  }
});

export default DTHRechargeScreen;
