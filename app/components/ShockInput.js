/**
 * @prettier
 */
import React from 'react'
import { TextInput, StyleSheet } from 'react-native'

import { Colors } from '../css'

interface Props {
  numberOfLines?: number;
  multiline?: boolean;
  onChangeText?: () => string;
  placeholder?: string;
  value?: string;
}

const INPUT_BORDER_RADIUS = 5
const INPUT_BORDER_WIDTH = 1
const INPUT_PADDING_LEFT = 16

const ShockInput: React.FunctionComponent<Props> = ({
  multiline,
  numberOfLines,
  onChangeText,
  placeholder,
  value,
}) => (
  <TextInput
    multiline={multiline}
    numberOfLines={numberOfLines}
    onChangeText={onChangeText}
    paddingLeft={INPUT_PADDING_LEFT}
    placeholder={placeholder}
    style={styles.input}
    value={value}
  />
)

const styles = StyleSheet.create({
  input: {
    borderColor: Colors.TEXT_LIGHTEST,
    borderRadius: INPUT_BORDER_RADIUS,
    borderWidth: INPUT_BORDER_WIDTH,
    color: Colors.TEXT_LIGHTEST,
    flex: 1,
  },
})

export default React.memo(ShockInput)
