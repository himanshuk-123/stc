import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import BackArrowButton from './BackArrowButton'
import { moderateScale, horizontalScale, verticalScale } from '../utils/responsive'
const Header = ({headingTitle, screenName = null}) => { 
  return (
    <View>
       <View style={styles.container}>
          <BackArrowButton screenName={screenName} />
          <Text  style={styles.headerTitle}>{headingTitle}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20)
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: horizontalScale(10),
  },
});


export default Header