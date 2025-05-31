import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen'
import ServicesScreen from '../screens/ServicesScreen';
import MoreScreen from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

export default function TabRouter() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Services') iconName = 'grid';
          else if (route.name === 'More') iconName = 'more-horizontal';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
