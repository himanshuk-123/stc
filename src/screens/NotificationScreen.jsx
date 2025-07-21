import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import Header from '../component/Header'
import GradientLayout from '../component/GradientLayout'

const NotificationScreen = () => {
  return (
    <GradientLayout>
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
        <Header headingTitle="Notifications"/>
        <Text style={styles.clearAllText}>Clear All</Text>
        </View>
    </SafeAreaView>
    </GradientLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  clearAllText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default NotificationScreen