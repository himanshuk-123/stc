import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, horizontalScale, verticalScale } from '../utils/responsive';
import { COLORS } from '../constants/colors';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { BORDERS } from '../constants/layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Cards - Reusable card component for services, options, etc.
 * 
 * @param {Object} props - Component props
 * @param {number} [props.imgheight] - Image height
 * @param {number} [props.imgwidth] - Image width
 * @param {string} [props.textColor='#000'] - Text color
 * @param {string} [props.fontWeight='bold'] - Font weight
 * @param {Object|number} props.imageSource - Image source (require or uri)
 * @param {string} props.title - Card title
 * @param {string|number} [props.width='48%'] - Card width
 * @param {string|number} props.height - Card height
 * @param {Array} [props.gradientColors=['#4facfe', '#00f2fe']] - Gradient colors
 * @param {string} [props.navigateTo=null] - Screen to navigate to
 * @param {Object} [props.style] - Additional style for title text
 * @param {Function} [props.onPress] - Custom onPress handler
 * @param {Object} [props.cardStyle] - Additional style for card container
 * @param {number} [props.margin=8] - Margin around card
 * @param {number} [props.cardsPerRow=2] - Number of cards per row
 * @param {React.ReactNode} [props.icon=null] - Icon component
 * @param {boolean} [props.showIcon=false] - Flag to show icon instead of image
 */
const Cards = ({
  imgheight,
  imgwidth,
  textColor = COLORS.text,
  fontWeight = FONT_WEIGHTS.bold,
  imageSource,
  title,
  width = '48%',
  height,
  gradientColors = [COLORS.primaryLight, COLORS.primary],
  navigateTo = null,
  style,
  onPress,
  cardStyle,
  margin = 8,
  cardsPerRow = 2,
  icon = null,
  showIcon = false
}) => {
  const navigation = useNavigation();

  // Calculate sizes based on responsive utils
  const calcImgWidth = imgwidth ? horizontalScale(imgwidth) : horizontalScale(60);
  const calcImgHeight = imgheight ? verticalScale(imgheight) : verticalScale(60);

  // Process width value
  let cardWidth = width;
  if (typeof width === 'number') {
    cardWidth = horizontalScale(width);
  }

  // Process height value
  let cardHeight = height;
  if (typeof height === 'number') {
    cardHeight = verticalScale(height);
  }

  const calcMargin = horizontalScale(margin);

  // Handle press event
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigateTo) {
      navigation.navigate(navigateTo);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.cardContainer,
        {
          width: cardWidth,
          height: cardHeight,
          marginVertical: calcMargin,
          marginHorizontal: calcMargin / 2,
        }, 
        cardStyle
      ]}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {showIcon && icon ? (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        ) : (
          <Image
            source={imageSource}
            style={[
              styles.image,
              {
                width: calcImgWidth,
                height: calcImgHeight,
              }
            ]}
            resizeMode="contain"
          />
        )}
        
        <Text
          style={[
            styles.title,
            {
              color: textColor,
              fontWeight,
              fontSize: moderateScale(14)
            },
            style
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // Base container styles
  },
  card: {
    flex: 1,
    borderRadius: BORDERS.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(8),
  },
  iconContainer: {
    marginBottom: verticalScale(8)
  },
  image: {
    marginBottom: verticalScale(8)
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: horizontalScale(4),
  },
});

export default Cards;
