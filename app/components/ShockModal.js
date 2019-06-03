/**
 * @prettier
 **/
import React from 'react'

import {
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import ShockButton from './ShockButton'

interface Props {
  onDismiss?: () => void;
  onRequestClose?: () => void;
  visible: boolean;
}

const ShockModal = ({ children, onDismiss, onRequestClose, visible }) => (
  <Modal
    animationType="fade"
    onDismiss={onDismiss}
    onRequestClose={onRequestClose}
    transparent
    visible={visible}
  >
    <TouchableWithoutFeedback onPress={onRequestClose}>
      <SafeAreaView style={styles.modalHolder}>
        <View style={styles.modal}>{children}</View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  </Modal>
)

const styles = {
  modal: {
    backgroundColor: 'white',
    marginBottom: 80,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 5,
  },

  modalHolder: {
    backgroundColor: 'rgba(36, 36, 36, 0.84)',
    justifyContent: 'center',
    flex: 1,
  },
}

export default React.memo(ShockModal)
