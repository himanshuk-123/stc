// MessageModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

// Import icons
import successIcon from '../../assets/successIcon.png';
import failIcon from '../../assets/failIcon.png';
import pendingIcon from '../../assets/pendingIcon.png';

const MessageModal = ({ 
  visible, 
  type, 
  title, 
  message, 
  onClose, 
  buttonText = "OK",
  onButtonPress,
  autoClose = true,
  // autoCloseTime = 3000,
  backgroundColor,
  iconColor = 'white',
  titleColor = 'white',
  messageColor = 'white',
  buttonColor = 'white',
  buttonTextColor = '#333'
}) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(height));

  React.useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(height);
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();
      
      // Auto close after specified time if enabled
      // if (autoClose) {
      //   const timer = setTimeout(() => {
      //     onClose();
      //   }, autoCloseTime);
        
      //   return () => clearTimeout(timer);
      // }
    }
  }, [visible]);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(onClose);
  };

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    closeModal();
  };

  if (!visible) return null;

  const isSuccess = type === 'success';
  const isPending = type === 'pending';
  const bgColor = backgroundColor || (isSuccess ? '#4CAF50' : isPending ? '#FFC107' : '#F44336');

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View 
          style={[
            styles.modalContainer, 
            { 
              backgroundColor: bgColor,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.content}>
            <Image 
              source={isSuccess ? successIcon : isPending ? pendingIcon : failIcon} 
              style={styles.iconImage}
              resizeMode="contain"
            />
            {title && <Text style={[styles.titleText, { color: titleColor }]}>{title}</Text>}
            <Text style={[styles.messageText, { color: messageColor }]}>{message}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: buttonColor }]} 
            onPress={handleButtonPress}
          >
            <Text style={[styles.buttonText, { color: buttonTextColor }]}>{buttonText}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <View style={[styles.closeIcon, { backgroundColor: 'white' }]}>
              <View style={[styles.closeLine, styles.closeLineFirst, { backgroundColor: '#333' }]} />
              <View style={[styles.closeLine, styles.closeLineSecond, { backgroundColor: '#333' }]} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 15,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
    lineHeight: 22,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  iconImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 40,
  },
  closeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeLine: {
    position: 'absolute',
    width: 2,
    height: 14,
  },
  closeLineFirst: {
    transform: [{ rotate: '45deg' }],
  },
  closeLineSecond: {
    transform: [{ rotate: '-45deg' }],
  },
  pendingHand: {
    position: 'absolute',
    width: 3,
    borderRadius: 2,
    top: '10%',
    right: '45%',
    transform: [{ rotate: '45deg' }],
  },
});

export default MessageModal;