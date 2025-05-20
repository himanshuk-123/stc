import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const Cards = ({
  imgheight = 60,
  imgwidth = 60,
  textColor = '#000',
  fontWeight = 'bold',
  imageSource,
  title,
  width = 150,
  height = 150,
  gradientColors = ['#4facfe', '#00f2fe'],
  navigateTo = 'TargetScreenName',
  style,
  onPress // ✅ Added this
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={onPress ? onPress : () => navigation.navigate(navigateTo)}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { width, height }]}
      >
        <Image
          source={imageSource}
          style={[styles.image, { width: imgwidth, height: imgheight }]}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: textColor, fontWeight }, style]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Cards;
