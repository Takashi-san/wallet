/** @format  */
import React from 'react'

import { View, StyleSheet, TouchableHighlight } from 'react-native'
import { Text } from 'react-native-elements'

/**
 * @typedef {object} Props
 * @prop {() => void} onPress
 * @prop {string} title
 */

/**
 * An instagram-dialog-style button.
 * @type {React.FC<Props>}
 */
const _IGDialogBtn = ({ onPress, title }) => (
  <TouchableHighlight onPress={onPress}>
    <View style={[styles.sidePadded, styles.btn]}>
      <Text>{title}</Text>
    </View>
  </TouchableHighlight>
)

const IGDialogBtn = React.memo(_IGDialogBtn)

const styles = StyleSheet.create({
  btn: {
    paddingBottom: 16,
    paddingTop: 16,
  },

  sidePadded: {
    paddingLeft: 10,
    paddingRight: 10,
  },
})

export default IGDialogBtn
