/**
 * @prettier
 */
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'

import { Colors } from '../css'

interface Props {
  alternateText?: string;
  alternateTextBold?: Boolean;
  lowerText: string;
  lowerTextStyle?: React.CSSProperties;
  image: string;
  id?: number | string;
  name: string;
  nameBold?: boolean;
  onPress: (id: number | string) => void;
  title?: string;
}

const SAMPLE_IMAGE =
  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'

const UserDetail: React.FunctionComponent<Props> = ({
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
  return (
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
            <Text
              numberOfLines={2}
              style={[styles.lowerText, lowerTextStyle && lowerTextStyle]}
            >
              {lowerText}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const nameTextStyle = {
  color: Colors.TEXT_STANDARD,
  fontSize: 16,
}

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
