import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import GradientLayout from '../component/GradientLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnableDisablePinScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  // ✅ Toggle Pin State and Save to AsyncStorage
  const handleToggle = () => {
    const newStatus = !isEnabled;
    setIsEnabled(newStatus);
    AsyncStorage.setItem('isPinEnabled', newStatus.toString());
  };

  // ✅ Load Pin Status on Mount
  useEffect(() => {
    const fetchPinStatus = async () => {
      const pinStatus = await AsyncStorage.getItem('isPinEnabled');
      setIsEnabled(pinStatus === 'true');
    };
    fetchPinStatus();
  }, []);

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <Header headingTitle="Enable/Disable Pin" />

        <View style={styles.toggleContainer}>
          <Text style={styles.label}>Transaction Pin</Text>

          <TouchableOpacity
            style={[
              styles.toggleBackground,
              { backgroundColor: isEnabled ? '#4ade80' : '#d1d5db' }
            ]}
            onPress={handleToggle}
          >
            <View
              style={[
                styles.toggleCircle,
                { left: isEnabled ? 22 : 3 }
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: isEnabled ? '#22c55e' : '#6b7280' }
                ]}
              >
                {isEnabled ? 'ON' : 'OFF'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: isEnabled ? '#22c55e' : 'red',
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 20
          }}
        >
          {isEnabled ? 'Pin is Enabled' : 'Pin is Disabled'}
        </Text>
      </SafeAreaView>
    </GradientLayout>
  );
};

export default EnableDisablePinScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  toggleContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black'
  },
  toggleBackground: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 3,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  toggleText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});
