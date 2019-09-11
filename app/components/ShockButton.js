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
import { Icon } from 'react-native-elements'

import { Colors } from '../css'

interface IconProps {
  name: string;
  color?: string;
  size?: number;
  type: string;
  iconStyle?: React.CSSProperties;
}

interface Props {
  color?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: IconProps;
  onPress?: () => void;
  title: string;
}

const DEFAULT_ICON_SIZE = 17
const DEFAULT_ICON_COLOR = Colors.TEXT_WHITE
const DEFAULT_ICON_STYLE = { marginRight: 8 }

const ShockButton: React.FunctionComponent<Props> = ({
  color,
  disabled,
  fullWidth,
  icon,
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
      <View style={styles.row}>
        <View>
          {icon && (
            <Icon
              name={icon.name}
              type={icon.type}
              size={icon.size ? icon.size : DEFAULT_ICON_SIZE}
              color={icon.color ? icon.color : DEFAULT_ICON_COLOR}
              iconStyle={icon.iconStyle ? icon.iconStyle : DEFAULT_ICON_STYLE}
            />
          )}
        </View>
        <Text style={styles.text}>{title}</Text>
      </View>
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

  row: {
    flexDirection: 'row',
  },
})

ShockButton.defaultProps = {
  title: '',
  color: Colors.ORANGE,
}

export default React.memo(ShockButton)
