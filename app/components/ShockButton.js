/**
 * @prettier
 */
import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import { Colors } from '../css'

interface Props {
  color?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  title: string;
}

const ShockButton: React.FunctionComponent<Props> = ({
  color,
  disabled,
  fullWidth,
  onPress,
  title,
}) => {
  const rootStyles = [styles.container]

  if (fullWidth) {
    rootStyles.push(styles.fullWidth)
  }

  if (color) {
    rootStyles.push({
      backgroundColor: color,
    })
  }

  return (
    <TouchableHighlight
      onPress={
        disabled
          ? undefined
          : () => {
              onPress && onPress()
            }
      }
      style={[rootStyles, disabled && styles.disabled]}
      underlayColor={color}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0,
    justifyContent: 'center',
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
  },

  disabled: {
    backgroundColor: Colors.GRAY_MEDIUM,
  },

  text: {
    color: Colors.TEXT_WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },

  fullWidth: {
    width: '100%',
  },
})

ShockButton.defaultProps = {
  title: '',
  color: Colors.ORANGE,
}

export default React.memo(ShockButton)
