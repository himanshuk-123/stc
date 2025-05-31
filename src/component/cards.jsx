import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, horizontalScale, verticalScale } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Cards = ({
  imgheight,
  imgwidth,
  textColor = '#000',
  fontWeight = 'bold',
  imageSource,
  title,
  width = '48%',
  height,
  gradientColors = ['#4facfe', '#00f2fe'],
  navigateTo = null,
  style,
  onPress,
  cardStyle,
  margin = 8,
  cardsPerRow = 2 // How many cards per row (2, 3, or 4)
}) => {
  const navigation = useNavigation();
  
  // Calculate responsive dimensions
  const calcImgWidth = imgwidth ? horizontalScale(imgwidth) : horizontalScale(60);
  const calcImgHeight = imgheight ? verticalScale(imgheight) : verticalScale(60);
  
  // Calculate responsive width
  let cardWidth = width;
  if (typeof width === 'number') {
    cardWidth = horizontalScale(width);
  }
  
  // Calculate responsive height
  let cardHeight = height;
  if (typeof height === 'number') {
    cardHeight = verticalScale(height);
  }
  
  // Calculate margins
  const calcMargin = horizontalScale(margin);
  
  return (
    <TouchableOpacity 
      onPress={onPress ? onPress : navigateTo ? () => navigation.navigate(navigateTo) : null}
      style={[{
        width: cardWidth,
        height: cardHeight,
        marginVertical: calcMargin,
        marginHorizontal: calcMargin / 2,
      }, cardStyle]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card]}
      >
        <Image
          source={imageSource}
          style={{
            width: calcImgWidth,
            height: calcImgHeight,
            marginBottom: verticalScale(8)
          }}
          resizeMode="contain"
        />
        <Text 
          style={[
            styles.title, 
            { 
              color: textColor, 
              fontWeight,
              fontSize: moderateScale(14)
            }, 
            style
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(8),
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: horizontalScale(4),
  },
});

export default Cards;
