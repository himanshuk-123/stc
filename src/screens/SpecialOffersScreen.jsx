import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Alert
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  // import Constants from 'expo-constants';
  import { useSelector } from 'react-redux';
  import { PlanService } from '../services/PlanService';
  import GradientLayout from '../component/GradientLayout';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { verticalScale } from '../utils/responsive';
  import Header from '../component/Header';
  import { useNavigation } from '@react-navigation/native';
  
  const SpecialOffersScreen = ({ route }) => {
    const { opcodenew, number,operator,mode, } = route.params;
    const userData = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [specialOffers, setSpecialOffers] = useState([]);
    const navigation = useNavigation();
  
    useEffect(() => {
      setLoading(true);
      const fetchSpecialOffers = async () => {
        try {
          const payload = {
            Tokenid: userData.tokenid,
            Version: "1",
            Operator: opcodenew,
            MobileNo: number,
            Location: userData.location
          };
          const response = await PlanService.SpecialOffers(
            payload.Tokenid,
            payload.Version,
            payload.Operator,
            payload.MobileNo,
            payload.Location
          );
          console.log(response.data);
          if(response.data.STATUS != '1'){
            Alert.alert("Error", response.data.MESSAGE,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]
              );
          }else{
            setSpecialOffers(response.data.RDATA);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchSpecialOffers();
    }, []);
  
    const handleCardPress = (item) => {
        navigation.replace('CompanyRecharge',{operator: operator, mode: mode, opcodenew: opcodenew, price: item.price, number: number,headingTitle:"Mobile Recharge"})
    };
  
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.7}
        onPress={() => handleCardPress(item)}
      >
        <View style={styles.cardimgContainer}>
          <Text style={styles.commAmt}>₹ {item.price}</Text>
        </View>
        <View style={styles.cardDetailsContainer}>
          <Text style={styles.name}>{item.ofrtext}</Text>
        </View>
      </TouchableOpacity>
    );
  
    if (loading) {
      return (
        <GradientLayout>
          <SafeAreaView style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
          </SafeAreaView>
        </GradientLayout>
      );
    }
  
    return (
      <GradientLayout>
        <SafeAreaView style={styles.container}>
          <Header headingTitle="Special Offers" />
          <View style={styles.listWrapper}>
            <FlatList
              data={specialOffers}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </GradientLayout>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: verticalScale(10),
      paddingVertical: verticalScale(10)
    },
    listWrapper: {
      paddingTop: verticalScale(10)
    },
    centered: {
      flex: 1,
      paddingHorizontal: verticalScale(10),
      paddingVertical: verticalScale(10),
      justifyContent: 'center',
      alignItems: 'center'
    },
    cardContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 12,
      elevation: 3,
      borderColor: '#ccc',
      borderWidth: 1,
      overflow: 'hidden'
    },
    cardimgContainer: {
      width: 90,
      padding: verticalScale(15),
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderColor: '#eee',
      backgroundColor: '#f9f9f9'
    },
    commAmt: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'green'
    },
    cardDetailsContainer: {
      flex: 1,
      padding: 10,
      justifyContent: 'center'
    },
    name: {
      fontSize: 14,
      color: 'purple'
    }
  });
  
  export default SpecialOffersScreen;
  