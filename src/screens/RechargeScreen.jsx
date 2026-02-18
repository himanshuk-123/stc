import { View, FlatList, Dimensions, SafeAreaView } from 'react-native';
import React from 'react';
import Header from '../component/Header';
import Cards from '../component/cards';
import mobile_recharge from '../../assets/mobile_recharge.png';
import dth_recharge from '../../assets/dth_Recharge.webp';
import GradientLayout from '../component/GradientLayout';
import { horizontalScale, moderateScale, verticalScale } from '../utils/responsive';
  
const DATA = [
  { id: '1', title: 'Mobile Recharge', image: mobile_recharge, navigateTo:'MobileRecharge' },
  { id: '2', title: 'DTH Recharge', image: dth_recharge, navigateTo:'DTHRecharge'}
];

const RechargeScreen = () => {
  // Calculate responsive dimensions
  const cardHeight = verticalScale(90);
  const cardWidth = "48%";

  return (
    <GradientLayout>
      <SafeAreaView style={{
        paddingHorizontal: horizontalScale(16),
        paddingTop: verticalScale(16)
      }}>
        <Header headingTitle="Recharges" />
        <FlatList
          data={DATA}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: verticalScale(16),
          }}
          renderItem={({ item }) => (
            <Cards
              imageSource={item.image}
              title={item.title}
              height={cardHeight}
              width={cardWidth}
              imgheight={verticalScale(35)}
              imgwidth={horizontalScale(60)} 
              gradientColors={['#ffffff', '#ffffff']}
              navigateTo={item.navigateTo}
              cardsPerRow={2}
              style={{ fontSize: moderateScale(13) }}
            />
          )}
        />
      </SafeAreaView>
    </GradientLayout>
  );
};

export default RechargeScreen;
