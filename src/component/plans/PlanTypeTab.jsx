/**
 * PlanTypeTab Component - Renders a single tab for plan types
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, BORDERS, FONT_WEIGHTS } from '../../utils/theme';

const PlanTypeTab = ({ item, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabItem,
        { backgroundColor: isSelected ? COLORS.secondary : COLORS.card },
      ]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.tabText, 
          { color: isSelected ? COLORS.textSecondary : COLORS.text }
        ]}
      >
        {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    paddingHorizontal: 15,
    height: 36,
    marginRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDERS.radius.lg,
  },
  tabText: {
    fontWeight: FONT_WEIGHTS.semiBold,
  },
});

export default PlanTypeTab;
