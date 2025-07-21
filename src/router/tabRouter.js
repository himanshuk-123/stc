import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import MoreScreen from '../screens/MoreScreen';

import home1 from '../../assets/home1.png';
import services1 from '../../assets/services1.png';
import more1 from '../../assets/more1.png';

const Tab = createBottomTabNavigator();

export default function TabRouter() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderColor: '#ccc',
        },
        // custom tab bar button
        tabBarButton: (props) => {
          const { children, onPress, accessibilityState } = props;
          const isSelected = accessibilityState?.selected;

          return (
            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.9}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 10,
                marginVertical: 6,
                borderRadius: 12,
                backgroundColor: isSelected ? '#d0f0c0' : 'transparent',
              }}
            >
              {children}
            </TouchableOpacity>
          );
        },
        tabBarIcon: ({ focused, size }) => {
          let icon;

          if (route.name === 'Home') icon = home1;
          else if (route.name === 'Services') icon = services1;
          else if (route.name === 'More') icon = more1;

          return (
            <Image
              source={icon}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? 'blue' : 'gray',
              }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
