/**
 * @prettier
 */
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'

import { Colors } from '../css'

/**
 * @typedef {object} Props
 * @prop {string=} alternateText
 * @prop {boolean=} alternateTextBold
 * @prop {string} lowerText
 * @prop {import('react-native').ViewStyle=} lowerTextStyle
 * @prop {string} image
 * @prop {string} id
 * @prop {string} name
 * @prop {boolean=} nameBold
 * @prop {((id: string) => void)=} onPress
 * @prop {string=} title
 */

const SAMPLE_IMAGE =
  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'

/**
 * @type {React.SFC<Props>}
 */
const UserDetail = ({
  alternateText,
  alternateTextBold,
  image,
  id,
  nameBold,
  lowerText,
  lowerTextStyle,
  name,
  onPress,
  title,
}) => {
  return ((
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(id)
      }}
    >
      <View style={styles.container}>
        <View style={[styles.avatarContainer, styles.subContainer]}>
          <Avatar rounded medium source={{ uri: SAMPLE_IMAGE }} />
        </View>

        <View style={[styles.subContainer, styles.textContainer]}>
          {title && <Text style={styles.title}>{title}</Text>}

          <Text
            numberOfLines={1}
            style={nameBold ? styles.nameBold : styles.name}
          >
            {name}
            <Text
              style={
                alternateTextBold
                  ? styles.alternateTextBold
                  : styles.alternateText
              }
            >
              {alternateText && ` ${alternateText}`}
            </Text>
          </Text>

          {lowerText && (
            <Text numberOfLines={2} style={lowerTextStyle && lowerTextStyle}>
              {lowerText}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ))
}

const nameTextStyle = {
  color: Colors.TEXT_STANDARD,
  fontSize: 16,
}

/**
 * @type {import('react-native').ViewStyle}
 */
const alternateTextStyle = {
  color: Colors.TEXT_LIGHT,
  fontSize: 14,
  fontWeight: '200',
}

const styles = StyleSheet.create({
  alternateText: {
    ...alternateTextStyle,
  },

  alternateTextBold: {
    ...alternateTextStyle,
    fontWeight: 'bold',
  },

  avatarContainer: {
    justifyContent: 'center',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    ...nameTextStyle,
  },

  nameBold: {
    ...nameTextStyle,
    color: Colors.TEXT_STANDARD,
    fontWeight: 'bold',
  },

  subContainer: {
    paddingLeft: 4,
    paddingRight: 4,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },

  title: {
    color: Colors.TEXT_LIGHT,
    fontWeight: '500',
  },
})

export default React.memo(UserDetail)
