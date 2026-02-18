import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import Header from '../component/Header'
import GradientLayout from '../component/GradientLayout'
import { getNotifications, deleteNotification, deleteAllNotifications, markNotificationAsRead } from '../utils/notificationStorage'
import { format } from 'date-fns'
import del from '../../assets/delete.png'
import { generateMultipleTestNotifications } from '../utils/notificationTestWithStorage'
const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load notifications when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const formatDate = (isoString) => {
  const date = new Date(isoString);
  const pad = (n) => (n < 10 ? '0' + n : n);
  
  return (
    date.getFullYear() + "-" +
    pad(date.getMonth() + 1) + "-" +
    pad(date.getDate()) + " " +
    pad(date.getHours()) + ":" +
    pad(date.getMinutes())
  );
};
  // Load notifications from AsyncStorage
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const notificationData = await getNotifications();
      setNotifications(notificationData);
      console.log(notificationData)
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Format the timestamp for display
  // const formatTimestamp = (timestamp) => {
  //   try {
  //     return format(new Date(timestamp), 'dd MMM yyyy, hh:mm a');
  //   } catch (error) {
  //     return 'Unknown date';
  //   }
  // };

  // Handle delete notification
  const handleDeleteNotification = async (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNotification(id);
            loadNotifications();
          },
        },
      ]
    );
  };

  // Handle clear all notifications
  const handleClearAll = () => {
    if (notifications.length === 0) return;
    
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await deleteAllNotifications();
            loadNotifications();
          },
        },
      ]
    );
  };

  // Handle notification press (mark as read)
  const handleNotificationPress = async (id) => {
    await markNotificationAsRead(id);
    loadNotifications();
  };

  // Render each notification item
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.read ? styles.readNotification : styles.unreadNotification]} 
      // onPress={() => handleNotificationPress(item.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity onPress={() => handleDeleteNotification(item.id)}>
           <Image source={del} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render empty state when no notifications
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={{fontSize: 40}}>🔔</Text>
      <Text style={styles.emptyText}>No notifications yet</Text>
      
      {/* Test button to generate notifications - only in development */}
      <TouchableOpacity 
        style={styles.testButton}
        onPress={async () => {
          const count = await generateMultipleTestNotifications(5);
          Alert.alert('Test Notifications', `${count} test notifications generated`);
          loadNotifications();
        }}
      >
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Header headingTitle="Notifications"/>
          <TouchableOpacity onPress={handleClearAll} disabled={notifications.length === 0}>
            <Text style={[styles.clearAllText, notifications.length === 0 && styles.disabledText]}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#121283" />
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyComponent}
            onRefresh={loadNotifications}
            refreshing={refreshing}
          />
        )}
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
    color: 'red',
  },
  disabledText: {
    color: '#cccccc',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#121283',
  },
  readNotification: {
    borderLeftWidth: 0,
    opacity: 0.8,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121283',
    flex: 1,
  },
  deleteIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  body: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#f1e5e5ff',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationScreen