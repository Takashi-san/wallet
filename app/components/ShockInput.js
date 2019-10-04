/**
 * @prettier
 */
import React from 'react'
import { TextInput, StyleSheet } from 'react-native'

import { Colors } from '../css'

/**
 * @typedef {object} Props
 * @prop {import('react-native').TextInputProps['keyboardType']=} keyboardType
 * @prop {number=} numberOfLines
 * @prop {boolean=} multiline
 * @prop {(text: string) => void} onChangeText
 * @prop {string=} placeholder
 * @prop {string=} value
 */

const INPUT_BORDER_RADIUS = 5
const INPUT_BORDER_WIDTH = 1
const INPUT_PADDING_LEFT = 16

/**
 * @type {React.FC<Props>}
 */
const ShockInput = ({
  keyboardType,
  multiline,
  numberOfLines,
  onChangeText,
  placeholder,
  value,
}) => ((
  <TextInput
    keyboardType={keyboardType}
    multiline={multiline}
    numberOfLines={numberOfLines}
    onChangeText={onChangeText}
    paddingLeft={INPUT_PADDING_LEFT}
    placeholder={placeholder}
    style={styles.input}
    value={value}
  />
))

const styles = StyleSheet.create({
  input: {
    borderColor: Colors.TEXT_LIGHTEST,
    borderRadius: INPUT_BORDER_RADIUS,
    borderWidth: INPUT_BORDER_WIDTH,
    color: Colors.TEXT_LIGHTEST,
  },
})

export default React.memo(ShockInput)
