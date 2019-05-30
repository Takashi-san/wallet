/**
 * @prettier
 */
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'

import { Colors } from '../../css'

// TODO: Placeholder while we figure out how we will transmit the image data.
// Either through GUN or some traditional backend
const img =
  'https://react-native-training.github.io/react-native-elements/img/avatar/avatar--photo.jpg'

interface Props {
  contactName: string;
  id: string;
  lastMessage: string;
  onPress?: (id: string) => void;
  timestamp: number;
  unread?: boolean;
}

const ChatPreview: React.FunctionComponent<Props> = ({
  contactName,
  id,
  lastMessage,
  onPress,
  timestamp,
  unread,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress && onPress(id)}>
      <View style={styles.container}>
        <View style={[styles.subContainer, styles.avatarContainer]}>
          <Avatar large rounded source={{ uri: img }} />
        </View>

        <View style={[styles.subContainer, styles.textContainer]}>
          <Text
            numberOfLines={1}
            style={
              unread ? styles.unreadContactNameText : styles.contactNameText
            }
          >
            {contactName}
            <Text
              style={unread ? styles.unreadTimeStamp : styles.timestampText}
            >
              {` (${timestamp})`}
            </Text>
          </Text>

          <Text
            style={unread ? styles.unreadLastMessage : styles.lastMessageText}
            numberOfLines={2}
          >
            {lastMessage}
          </Text>
        </View>

        <View style={[styles.subContainer, styles.arrowContainer]}>
          <Icon
            size={28}
            name="chevron-right"
            type="font-awesome"
            color={Colors.ORANGE}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const unreadContactNameText = {
  color: Colors.TEXT_STANDARD,
  fontSize: 14,
  fontWeight: 'bold',
}

const lastMessageText = {
  color: Colors.TEXT_LIGHTEST,
  fontSize: 12,
}

const timestampText = {
  color: Colors.TEXT_LIGHT,
}

const styles = StyleSheet.create({
  // hack is simpler than alternatives
  arrowContainer: {
    marginLeft: 4,
    marginRight: 10,
  },

  avatarContainer: {
    paddingBottom: 20,
  },

  container: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  contactNameText: {
    ...unreadContactNameText,
    fontWeight: 'normal',
    color: Colors.TEXT_STANDARD,
  },

  lastMessageText: {
    ...lastMessageText,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 16,
  },

  textStyle: {
    textAlign: 'center',
  },

  timestampText: {
    ...timestampText,
  },

  subContainer: {
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4,
  },

  unreadContactNameText: {
    ...unreadContactNameText,
  },

  unreadLastMessage: {
    ...lastMessageText,
    color: Colors.TEXT_STANDARD,
    fontWeight: 'bold',
  },

  unreadTimeStamp: {
    ...timestampText,
    color: Colors.TEXT_LIGHT,
  },
})

export default ChatPreview
