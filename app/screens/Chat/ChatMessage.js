/**
 * @prettier
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import moment from 'moment'

import { Colors } from '../../css'

interface Props {
  body: string,
  id: string,
  onPress?: (id: string) => void,
  outgoing?: boolean,
  senderName: string,
  timestamp: number,
}

const ChatMessage: React.FunctionComponent<Props> = ({
  body,
  id,
  onPress,
  outgoing,
  senderName,
  timestamp
}) => {
  return (
    <TouchableOpacity onPress={() => onPress && onPress(id)}>
      <View style={outgoing ? styles.container : styles.containerOutgoing}>
        <Text style={outgoing ? styles.name : styles.nameOutgoing}>
          {senderName}
        </Text>

        <Text style={styles.timestamp}>
          {moment(timestamp).fromNow()}
        </Text>

        <Text style={styles.body}>
          {body}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const name = {
  color: Colors.TEXT_STANDARD,
  fontSize: 14,
  fontWeight: 'bold'
}

const CONTAINER_HORIZONTAL_PADDING = 12
const CONTAINER_VERTICAL_PADDING = 18

const container = {
  alignItems: 'flex-start',
  backgroundColor: Colors.GRAY_MEDIUM,
  borderRadius: 10,
  justifyContent: 'center',
  margin: 15,
  paddingBottom: CONTAINER_VERTICAL_PADDING,
  paddingLeft: CONTAINER_HORIZONTAL_PADDING,
  paddingRight: CONTAINER_HORIZONTAL_PADDING,
  paddingTop: CONTAINER_VERTICAL_PADDING,
}

const styles = StyleSheet.create({
  body: {
    color: Colors.TEXT_STANDARD,
    fontSize: 15,
    marginTop: 8,
  },
  container,
  containerOutgoing: {
    ...container,
    backgroundColor: Colors.BLUE_LIGHT,
  },
  name,
  nameOutgoing: {
    ...name,
    color: Colors.BLUE_DARK,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.TEXT_LIGHT
  }
});

export default React.memo(ChatMessage);