import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';

const ProgressScreen = () => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 seconds
  const [status, setStatus] = useState('PENDING'); // PENDING, QUEUED

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(countdown);
      setStatus('QUEUED'); // after 2 minutes
    }, 120000); // 2 min

    return () => {
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <GradientLayout>
        <SafeAreaView style={{flex:1,padding:16}}>
            <Header
            headingTitle={"Payment Request"}
            />
        <View style={styles.container}>
      {status === 'PENDING' ? (
        <>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.waitText}>Processing your payment request...</Text>
          <Text style={styles.timerText}>{timeLeft} seconds remaining</Text>
        </>
      ) : (
        <Text style={styles.queueText}>
          ⏳ Your request is still in the queue. You will be notified once it is approved.
        </Text>
      )}
    </View>
    </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  waitText: {
    fontSize: 18,
    marginTop: 20
  },
  timerText: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray'
  },
  queueText: {
    fontSize: 18,
    color: 'orange',
    textAlign: 'center',
    paddingHorizontal: 20
  }
});

export default ProgressScreen;
