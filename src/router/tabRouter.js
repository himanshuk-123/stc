import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import MoreScreen from '../screens/MoreScreen';

// Import assets
import home1 from '../../assets/home1.png';
import services1 from '../../assets/services1.png';
import more1 from '../../assets/more1.png';

// Import theme constants
import { COLORS } from '../constants/colors';
import { moderateScale } from '../utils/responsive';

const Tab = createBottomTabNavigator();

/**
 * TabRouter - Bottom tab navigation component for main app sections
 * @returns {React.ReactElement} Bottom tab navigator component
 */
export default function TabRouter() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: COLORS.WHITE,
          borderTopWidth: 1,
          borderColor: COLORS.BORDER,
          elevation: 0,
          shadowOpacity: 0,
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
                backgroundColor: isSelected ? COLORS.TAB_ACTIVE : 'transparent',
              }}
              accessibilityRole="button"
              accessibilityLabel={`${route.name} tab`}
              accessibilityState={{ selected: isSelected }}
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
                tintColor: focused ? COLORS.PRIMARY : COLORS.INACTIVE,
              }}
              resizeMode="contain"
              accessibilityIgnoresInvertColors={true}
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarAccessibilityLabel: "Home Screen"
        }}
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesScreen}
        options={{
          tabBarAccessibilityLabel: "Services Screen"
        }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{
          tabBarAccessibilityLabel: "More Screen"
        }}
      />
    </Tab.Navigator>
  );
}
