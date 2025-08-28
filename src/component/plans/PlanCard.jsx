/**
 * PlanCard Component - Renders a single plan card
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONT_SIZES, BORDERS, SHADOWS, FONT_WEIGHTS } from '../../utils/theme';

// Plan feature types with their icons
const FEATURE_ICONS = {
  data: require('../../../assets/wifi.png'),
  calls: require('../../../assets/phone_icon.png'),
  sms: require('../../../assets/sms.png'),
};

const PlanCard = ({ plan, isSelected, onSelect }) => {
  const renderFeatures = () => {
    const features = [
      { type: 'data', value: plan.data },
      { type: 'calls', value: plan.calls },
      { type: 'sms', value: plan.sms },
    ].filter(feature => feature.value); // Only show features with values
    
    return features.map((feature) => (
      <View key={feature.type} style={styles.detailBox}>
        <Image 
          source={FEATURE_ICONS[feature.type]} 
          style={styles.featureIcon} 
        />
        <Text style={styles.detailItem}>{feature.value}</Text>
      </View>
    ));
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(plan)}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: isSelected ? COLORS.primary : COLORS.border,
            borderWidth: isSelected ? BORDERS.width.thick : BORDERS.width.regular,
            ...(isSelected ? SHADOWS.medium : SHADOWS.small),
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.validityText}>₹{plan.price}</Text>
          <Text style={styles.validityDays}>({plan.validityDays} days)</Text>
          <Text style={styles.perDay}>@ ₹{plan.dailyCost}/D</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.featuresContainer}>
            {renderFeatures()}
          </View>

          <View>
            <Text style={styles.benefitText}>{plan.benefit}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: BORDERS.radius.md,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingRight: 10,
  },
  validityText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    paddingRight: 10,
    marginBottom: 5,
  },
  validityDays: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.bold,
  },
  perDay: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 5,
    borderLeftWidth: BORDERS.width.regular,
    borderColor: COLORS.borderDark,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 10,
    rowGap: 8,
    columnGap: 10,
  },
  detailBox: {
    flexShrink: 1,
    maxWidth: '30%',
    minWidth: '30%',
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  detailItem: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.accent,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  benefitText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
});

export default PlanCard;
