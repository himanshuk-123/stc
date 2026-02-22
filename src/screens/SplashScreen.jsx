import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import logo from '../../assets/logo.png';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>STC</Text>
      <ActivityIndicator size="large" color="#0b0866" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f9ff'
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0b0866',
    marginBottom: 24
  }
});

export default SplashScreen;
