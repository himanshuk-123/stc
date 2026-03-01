import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, FlatList, Modal, Text, TouchableOpacity, Dimensions, TextInput, Alert, ActivityIndicator, StyleSheet, Image, Platform, PermissionsAndroid } from 'react-native';
import Header from '../component/Header';
import Cards from '../component/cards';
import RechargeApiServices from '../services/RechargeService';
import GradientLayout from '../component/GradientLayout';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { logout } from '../utils/authUtils';
import axios from 'axios';
import Contacts from 'react-native-contacts';
import contactIcon from '../../assets/contact.jpeg';


const IMAGE_BASE_URL = 'https://onlinerechargeservice.in/';

const MobileRechargeScreen = () => {
  const [services, setServices] = useState([]);
  const userData = useSelector(state => state.user);
  const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [showContactList, setShowContactList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactsLoading, setContactsLoading] = useState(false);
  const mode = '1';

  // Calculate responsive dimensions
  const cardWidth = "90%";
  const cardHeight = verticalScale(80);

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
      console.log('Payload:', payload);

      const response = await RechargeApiServices.operator(
        payload.Tokenid,
        payload.mode,
        payload.Version,
        payload.Location
      );

      const data = response.data;
      console.log('API Response:', data);

      if (data.ERROR === '11') {
        setShowErrorModal(true);
        setErrorMessage("Authentication failed");
      }
      else if (data.ERROR === '0') {
        const formattedData = data.Operator.map((item, index) => ({
          id: index.toString(),
          opcodenew: item.opcodenew,
          name: item.operatorname,
          image: IMAGE_BASE_URL + item.operator_img.replace(/^~\//, ''),
        }))
        setServices(formattedData);
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

  const renderItem = ({ item }) => (
    <View style={{
      width: '33%',
      alignItems: 'center',
      marginVertical: verticalScale(8)
    }}>
      <Cards
        imageSource={{ uri: item.image }}
        title={item.name}
        height={cardHeight}
        width={cardWidth}
        imgheight={verticalScale(50)}
        imgwidth={horizontalScale(50)}
        gradientColors={['#ffffff', '#ffffff']}
        style={{ fontSize: moderateScale(12) }}
        onPress={() => navigation.navigate('CompanyRecharge', {operator: item, mode: mode, opcodenew: item.opcodenew ,headingTitle:"Mobile Recharge"})}
        cardsPerRow={3}
      />
    </View>
  );

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    // Use the global logout function
    logout();
  };

  const getOperatorCodeByName = (operatorName) => {
    const match = services.find(
      (item) => item.name.toLowerCase() === operatorName.toLowerCase()
    );
    return match ? match.opcodenew : null;
  };

  

  const onPhoneSubmit = async (number) => {
    setLoading(true);
    console.log("Fetching operator for number:", number);
    try {
      const response = await axios.get(`https://onlinerechargeservice.in/Api/Plan/FetchOperator?TokenId=da9c3bba-770c-4034-af9e-20e4959b26f2&Number=${number}`);
      console.log("Response:", response.data);
  
      const operatorName = response.data.OperatorName;
      console.log("Operator Name from API:", operatorName);
      
      const operatorCode = getOperatorCodeByName(operatorName);
      console.log("Operator Code:", operatorCode);
      const operator = services.find(item => item.name.toLowerCase() === operatorName.toLowerCase());
      if (!operator) {
        Alert.alert(`This number is not a valid number `);
        return;
      }
      // Ab tum yahan API ya state update kar sakte ho
      navigation.navigate('CompanyRecharge', { operator: operator, mode: mode, opcodenew: operatorCode, number: number,headingTitle:"Mobile Recharge" });
      setPhoneNumber('');
    } catch (error) {
      console.log("Error:", error);
    }finally {
      setLoading(false);
    }
  };
  

  const openContacts = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'App needs access to your contacts.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot access contacts.');
          return;
        }
      }
      setContactsLoading(true);
      Contacts.getAll().then((allContacts) => {
        setContactsLoading(false);
        const filtered = allContacts.filter(
          (c) => c.phoneNumbers && c.phoneNumbers.length > 0
        );
        setContacts(filtered);
        setShowContactList(true);
      }).catch((err) => {
        setContactsLoading(false);
        console.error('getAll error:', err);
      });
    } catch (error) {
      setContactsLoading(false);
      console.error('Contact error:', error);
    }
  };

  const sanitizePhoneNumber = (number) => {
    let sanitized = number.replace(/\D/g, '');
    if (sanitized.startsWith('91') && sanitized.length > 10) {
      sanitized = sanitized.substring(2);
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.substring(sanitized.length - 10);
    }
    return sanitized;
  };

  const validateIndianMobileNumber = (number) => {
    return /^[6789]\d{9}$/.test(number);
  };

  const processSelectedContact = (contact) => {
    let mobileNumber = contact.phoneNumbers.find(
      p => p.label?.toLowerCase() === 'mobile'
    )?.number;
    if (!mobileNumber) {
      mobileNumber = contact.phoneNumbers[0]?.number;
    }
    if (mobileNumber) {
      const sanitized = sanitizePhoneNumber(mobileNumber);
      if (validateIndianMobileNumber(sanitized)) {
        setPhoneNumber(sanitized);
        setShowContactList(false);
        setSearchQuery('');
        // Auto-submit if 10 digits
        if (sanitized.length === 10) {
          onPhoneSubmit(sanitized);
        }
      } else {
        Alert.alert('Invalid Number', 'Please pick a valid 10-digit Indian number.');
      }
    }
  };

  const handleInputChange = (text) => {
    // Sirf digits allow karo
    const cleaned = text.replace(/[^0-9]/g, '');

    setPhoneNumber(cleaned);

    if (cleaned.length === 10) {
      onPhoneSubmit(cleaned);
    }
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <GradientLayout>
      <SafeAreaView style={{
        paddingVertical: verticalScale(16),
        paddingHorizontal: horizontalScale(16)
      }}>
        <Header headingTitle="Mobile Recharge" />

        {/* Contacts Modal */}
        {showContactList && (
          <Modal visible={showContactList} animationType="slide">
            <SafeAreaView style={styles.contactModalContainer}>
              <Text style={styles.contactModalTitle}>Select a Contact</Text>
              <TextInput
                placeholder="Search by name or number..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.contactSearchInput}
                placeholderTextColor="#888"
              />
              <FlatList
                data={contacts.filter(c => {
                  const fullName = (c.displayName || `${c.givenName || ''} ${c.familyName || ''}`).toLowerCase();
                  const number = c.phoneNumbers[0]?.number || '';
                  return (
                    fullName.includes(searchQuery.toLowerCase()) ||
                    number.includes(searchQuery)
                  );
                })}
                keyExtractor={(item, index) => item.recordID?.toString() || index.toString()}
                renderItem={({ item }) => {
                  const fullName = item.displayName ||
                    `${item.givenName || ''} ${item.familyName || ''}`.trim() ||
                    'Unknown';
                  const number = item.phoneNumbers[0]?.number || '';
                  return (
                    <TouchableOpacity
                      style={styles.contactItem}
                      onPress={() => processSelectedContact(item)}
                    >
                      <View style={styles.contactAvatar}>
                        <Text style={styles.contactAvatarText}>
                          {fullName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.contactName}>{fullName}</Text>
                        <Text style={styles.contactNumber}>{number}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setShowContactList(false);
                  setSearchQuery('');
                }}
                style={styles.contactCancelButton}
              >
                <Text style={styles.contactCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Modal>
        )}

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Enter Mobile No"
            style={styles.input}
            placeholderTextColor="#888"
            value={phoneNumber}
            onChangeText={handleInputChange}
            maxLength={10}
            keyboardType="number-pad"
          />
          <TouchableOpacity onPress={openContacts} disabled={contactsLoading}>
            {contactsLoading ? (
              <ActivityIndicator size="small" color="#007bff" />
            ) : (
              <Image source={contactIcon} style={{ height: 30, width: 30 }} />
            )}
          </TouchableOpacity>
        </View>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: verticalScale(120)
          }}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    borderRadius: 9999,
    paddingHorizontal: 15,
    marginBottom: 4,
    height: 50
  },
  input: {
    paddingHorizontal: 10,
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  contactModalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  contactModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  contactSearchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 4,
    fontSize: 16,
    color: '#000',
  },
  contactItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contactNumber: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  contactCancelButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    alignItems: 'center',
  },
  contactCancelButtonText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
});


export default MobileRechargeScreen;
