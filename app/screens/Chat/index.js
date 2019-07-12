/**
 * @prettier
 */
import React from 'react'
import moment from 'moment'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { GiftedChat, Send } from 'react-native-gifted-chat'

import ChatMessage from './ChatMessage'

const LOCAL_MOCK_USER = {
  _id: 1,
  avatar: 'https://placeimg.com/140/140/any',
  name: 'Amanda Peters',
}

const REMOTE_MOCK_USER = {
  _id: 2,
  avatar: 'https://placeimg.com/140/140/any',
  name: 'Tom Wallace',
}

const MOCK_MESSAGES = [
  {
    _id: 5,
    text: 'Got it. Thanks a lot for the coins!',
    createdAt: moment().toDate(),
    user: REMOTE_MOCK_USER,
  },
  {
    _id: 4,
    text: 'Sent! Please confirm.',
    createdAt: moment()
      .subtract(1, 'minutes')
      .toDate(),
    user: LOCAL_MOCK_USER,
  },
  {
    _id: 3,
    text: 'No worries, thanks for the update!',
    createdAt: moment()
      .subtract(30, 'minutes')
      .toDate(),
    user: REMOTE_MOCK_USER,
  },
  {
    _id: 2,
    text: 'Will do in a bit. Sorry, just got caught in traffic earlier today!',
    createdAt: moment()
      .subtract(3, 'hours')
      .toDate(),
    user: LOCAL_MOCK_USER,
  },
  {
    _id: 1,
    text: 'Hey, did you send the coins yet?',
    createdAt: moment()
      .subtract(8, 'hours')
      .toDate(),
    user: REMOTE_MOCK_USER,
  },
]

const Loading = () => (
  <View style={styles.loading}>
    <Text>Loading</Text>
  </View>
)

const SendRenderer = props => (
  <Send {...props}>
    <View style={styles.sendIcon}>
      <Icon name="paper-plane" type="font-awesome" />
    </View>
  </Send>
)

interface GiftedChatUser {
  _id: number;
  name: string;
}

interface State {
  localUser: null | GiftedChatUser;
  thereAreMoreMessages: boolean;
}

export default class Chat extends React.PureComponent<{}, State> {
  state = {
    localUser: null,
    messages: [],
    thereAreMoreMessages: false,
  }

  /**
   * @type {import('react-native-gifted-chat').GiftedChatProps['renderMessage']}
   */
  messageRenderer = ({ currentMessage }) => {
    const outgoing = currentMessage.user !== this.state.localUser

    return ((
      <View style={outgoing ? styles.alignFlexStart : styles.alignFlexEnd}>
        <View style={styles.maxWidth}>
          <ChatMessage
            id={currentMessage._id}
            body={currentMessage.text}
            outgoing={outgoing}
            senderName={currentMessage.user.name}
            timestamp={currentMessage.createdAt.getTime()}
          />
        </View>
      </View>
    ))
  }

  componentDidMount() {
    this.setState({
      localUser: LOCAL_MOCK_USER,
      messages: MOCK_MESSAGES,
      thereAreMoreMessages: false,
    })
  }

  render() {
    const { localUser, thereAreMoreMessages } = this.state

    if (localUser === null) {
      return (
        <Text>
          If you're seeing this text, this screen is being navigated to without
          actually getting the value for the local user. That is, id and name at
          least.
        </Text>
      )
    }

    return (
      <GiftedChat
        isLoadingEarlier={thereAreMoreMessages}
        loadEarlier={thereAreMoreMessages}
        messages={this.state.messages}
        user={LOCAL_MOCK_USER}
        renderLoading={Loading}
        renderMessage={this.messageRenderer}
        renderSend={SendRenderer}
      />
    )
  }
}

const styles = StyleSheet.create({
  alignFlexEnd: {
    alignItems: 'flex-end',
  },

  alignFlexStart: {
    alignItems: 'flex-start',
  },

  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  maxWidth: {
    maxWidth: '85%',
  },

  sendIcon: { marginRight: 10, marginBottom: 10 },
})
