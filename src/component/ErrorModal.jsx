import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { moderateScale, verticalScale, horizontalScale } from '../utils/responsive';
import { COLORS } from '../constants/colors';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { BORDERS } from '../constants/layout';

/**
 * ErrorModal - Reusable error modal component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {string} props.message - Error message to display
 * @param {Function} props.onClose - Function to call when OK button is pressed
 * @param {string} [props.title="Alert"] - Modal title
 * @param {string} [props.buttonText="OK"] - Button text
 */
const ErrorModal = ({ 
  visible, 
  message, 
  onClose, 
  title = "Alert", 
  buttonText = "OK" 
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.overlay
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: verticalScale(24),
    borderRadius: BORDERS.radius.md,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: verticalScale(16),
    color: COLORS.text
  },
  modalMessage: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: verticalScale(24),
    fontSize: FONT_SIZES.md
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(48),
    borderRadius: BORDERS.radius.full
  },
  buttonText: {
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.lg
  }
});

export default ErrorModal;
