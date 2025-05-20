import { View, FlatList, Dimensions, SafeAreaView } from 'react-native';
import React from 'react';
import Header from '../component/Header';
import Cards from '../component/cards';
import mobile_recharge from '../../assets/mobile_recharge.png';
import GradientLayout from '../component/GradientLayout';

const DATA = [
  { id: '1', title: 'Mobile Recharge', image: mobile_recharge,navigateTo:'MobileRechargeScreen' },
  { id: '2', title: 'DTH Recharge', image: mobile_recharge,navigateTo:'DTHRechargeScreen'},
  { id: '3', title: 'Metro Card', image: mobile_recharge },
  { id: '4', title: 'FASTag', image: mobile_recharge },
];

const RechargeScreen = () => {
  return (
    <GradientLayout>
    <SafeAreaView className=" px-4 pt-4">
      <Header headingTitle="Recharges" />
      <FlatList
  data={DATA}
  numColumns={2}
  keyExtractor={(item) => item.id}
  columnWrapperStyle={{
    justifyContent: 'flex-start',
    marginBottom: 16,
  }}
  renderItem={({ item }) => (
    <Cards
      imageSource={item.image}
      title={item.title}
      height={130}
      width={150} 
      gradientColors={['#ffffff', '#ffffff']}
      navigateTo={item.navigateTo}
    />
  )}
/>
    </SafeAreaView>
    </GradientLayout>
    
  );
};

export default RechargeScreen;
