import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import qr from '../../assets/qr-icon.png'
import logoutIcon from '../../assets/logout.png'
import supportIcon from '../../assets/support-icon.png'
import Header from '../component/Header';
import Cards from '../component/cards';
import GradientLayout from '../component/GradientLayout';
import GeneratQrCode from '../component/GeneratQrCode';
import { logout } from '../utils/authUtils';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';

const features = [
  {
    id: '5',
    name: 'Help & Support',
    showIcon: true,
    icon: <Image source={supportIcon} style={{width:30,height:30}} />,
    navigate: 'Support'
  },
  {
    id: '12',
    name: 'Contact Us',
    image: require('../../assets/contactUsimg.png'),
    navigate: 'Contact'
  },
  {
    id: '13',
    name: 'Change Pin',
    image: require('../../assets/changePin.png'),
    navigate: 'ChangePin'
  },
  {
    id: '14',
    name: 'Change Password',
    image: require('../../assets/changePass.png'),
    navigate: 'ChangePassword'
  },
  {
    id: '15',
    name: 'Enable/Disable Pin',
    image: require('../../assets/enabledisable.png'),
    navigate: 'EnableDisablePin'
  },  {
    id: '6',
    name: 'Logout',
    showIcon: true,
    icon: <Image source={logoutIcon} style={{width:30,height:30}} />,
    navigate: 'Logout'
  },
  {
    id: '90',
    name: 'Add User',
    image: require('../../assets/add_user.png'),
    navigate: 'AddUser'
  },
  {
    id: '91',
    name: 'Home 2',
    image: require('../../assets/home.png'), 
    navigate: 'HomeScreen2'
  }
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user);
  const [showqr, setShowqr] = useState(false);

  const cardWidth = '93%';
  const cardHeight = verticalScale(70);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => logout(navigation)
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={{
      width: '33%',
      alignItems: 'center',
      marginVertical: verticalScale(8)
    }}>
      <Cards
        title={item.name}
        icon={item.icon}
        showIcon={item.showIcon}
        imageSource={item.image}
        height={cardHeight}
        width={cardWidth}
        imgheight={verticalScale(40)}
        imgwidth={horizontalScale(40)}
        gradientColors={['#ffffff', '#ffffff']}
        style={{ fontSize: moderateScale(13) }}
        onPress={
          item.navigate === 'Logout'
            ? handleLogout
            : item.navigate
              ? () => navigation.navigate(item.navigate)
              : null
        }
      />
    </View>
  );

  return (
    <GradientLayout>
      <SafeAreaView style={{
        paddingHorizontal: horizontalScale(16),
        paddingTop: verticalScale(16)
      }}>
        <ScrollView style={{ marginBottom: verticalScale(10) }}>
          <Header />
          <View style={styles.profileImageContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={require('../../assets/logo.png')}
                resizeMode="cover"
                style={styles.profileImage}
              />
            </View>
          </View>

          <View style={styles.userInfoContainer}>
            <Text style={styles.shopName}>{userData.shopname}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </View>

          <View style={styles.qrToggleContainer}>
            <TouchableOpacity onPress={() => setShowqr(!showqr)} style={styles.qrButton}>
             <Image source={qr} style={{width:34,height:34}} />
              <Text style={styles.qrButtonText}>{showqr ? 'Hide QR Code' : 'Show QR Code'}</Text>
            </TouchableOpacity>
          </View>

          {showqr && (
            <View style={styles.qrCodeContainer}>
              <GeneratQrCode mobileNumber={userData.mobilenumber} userName={userData.shopname} />
            </View>
          )}

          <FlatList
            data={features}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  profileImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageWrapper: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    width: '100%',
    height: '50%'
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24
  },
  shopName: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
    color: 'black'
  },
  email: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: 'black'
  },
  qrToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(10)
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(10)
  },
  qrButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: 'black'
  },
  qrCodeContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProfileScreen;
