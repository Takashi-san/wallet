/**
 * @prettier
 */
import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import { GiftedChat, Send } from 'react-native-gifted-chat'
/**
 * @typedef {import('react-native-gifted-chat').IMessage} GiftedChatMessage
 * @typedef {import('react-native-gifted-chat').User} GiftedChatUser
 * @typedef {import('react-navigation').NavigationScreenProp<{}, Params>} Navigation
 */

import * as API from '../../services/contact-api'

import ChatMessage from './ChatMessage'

export const CHAT_ROUTE = 'CHAT_ROUTE'

/**
 * @param {{ timestamp: number }} a
 * @param {{ timestamp: number }} b
 * @returns {number}
 */
const byTimestampFromOldestToNewest = (a, b) => a.timestamp - b.timestamp

const Loading = () => (
  <View style={styles.loading}>
    <Text>Loading</Text>
  </View>
)

/**
 * @param {Record<string, any>} props
 */
const SendRenderer = props => (
  <Send {...props}>
    <View style={styles.sendIcon}>
      <Icon name="paper-plane" type="font-awesome" />
    </View>
  </Send>
)

/**
 * @typedef {object} Params
 * @prop {string} recipientPublicKey
 */

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {object} State
 * @prop {API.Schema.ChatMessage[]|null} messages
 * @prop {string|null} ownDisplayName
 * @prop {string|null} ownPublicKey
 * @prop {string|null} recipientDisplayName
 */

/**
 * @augments React.PureComponent<Props, State>
 */
export default class Chat extends React.PureComponent {
  /**
   * @param {{ navigation: Navigation }} args
   * @returns {import('react-navigation').NavigationStackScreenOptions}
   */
  static navigationOptions = ({ navigation }) => {
    // @ts-ignore
    const title = navigation.getParam('title')

    return {
      // headerTransparent: true,
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
      },

      title,
    }
  }

  /** @type {State} */
  state = {
    messages: null,
    ownDisplayName: null,
    ownPublicKey: null,
    recipientDisplayName: null,
  }

  componentDidUpdate() {
    const { navigation } = this.props
    const { recipientDisplayName } = this.state
    const recipientPK = navigation.getParam('recipientPublicKey')
    // @ts-ignore
    const oldTitle = navigation.getParam('title')

    if (typeof oldTitle === 'undefined') {
      navigation.setParams({
        // @ts-ignore
        title: recipientPK,
      })
    }

    if (oldTitle === recipientPK && recipientDisplayName) {
      navigation.setParams({
        // @ts-ignore
        title: recipientDisplayName,
      })
    }
  }

  componentDidMount() {
    this.authUnsub = API.Events.onAuth(this.onAuth)
    this.chatsUnsub = API.Events.onChats(this.onChats)
    this.displayNameUnsub = API.Events.onDisplayName(displayName => {
      this.setState({
        ownDisplayName: displayName,
      })
    })
  }

  authUnsub = () => {}
  chatsUnsub = () => {}
  displayNameUnsub = () => {}

  /**
   * @private
   * @param {API.Events.AuthData} authData
   * @returns {void}
   */
  onAuth = authData => {
    authData &&
      this.setState({
        ownPublicKey: authData.publicKey,
      })
  }

  /**
   * @private
   * @type {import('react-native-gifted-chat').GiftedChatProps['renderMessage']}
   */
  messageRenderer = ({ currentMessage }) => {
    if (typeof currentMessage === 'undefined') {
      console.warn("typeof currentMessage === 'undefined'")
      return null
    }

    const recipientPublicKey = this.props.navigation.getParam(
      'recipientPublicKey',
    )

    if (!recipientPublicKey) {
      return null
    }

    const ownPublicKey = this.state.ownPublicKey

    if (ownPublicKey === null) {
      return null
    }

    const user = currentMessage.user

    const outgoing = user._id !== recipientPublicKey

    const senderName =
      typeof user.name === 'string' && user.name.length > 0
        ? user.name
        : user._id

    const timestamp =
      typeof currentMessage.createdAt === 'number'
        ? currentMessage.createdAt
        : currentMessage.createdAt.getTime()

    return (
      <View style={outgoing ? styles.alignFlexStart : styles.alignFlexEnd}>
        <View style={styles.maxWidth}>
          <ChatMessage
            id={currentMessage._id}
            body={currentMessage.text}
            outgoing={outgoing}
            senderName={senderName}
            timestamp={timestamp}
          />
        </View>
      </View>
    )
  }

  /**
   * @private
   * @param {API.Schema.Chat[]} chats
   * @returns {void}
   */
  onChats = chats => {
    const { navigation } = this.props

    const recipientPublicKey = navigation.getParam('recipientPublicKey')

    const theChat = chats.find(
      chat => chat.recipientPublicKey === recipientPublicKey,
    )

    if (!theChat) {
      return
    }

    this.setState({
      messages: theChat.messages,
      recipientDisplayName:
        typeof theChat.recipientDisplayName === 'string' &&
        theChat.recipientDisplayName.length > 0
          ? theChat.recipientDisplayName
          : null,
    })
  }

  /**
   * @private
   * @param {GiftedChatMessage[]} msgs
   * @returns {void}
   */
  onSend = msgs => {
    const [msg] = msgs

    API.Actions.sendMessage(
      this.props.navigation.getParam('recipientPublicKey'),
      msg.text,
    )
  }

  render() {
    const {
      messages,
      ownDisplayName,
      ownPublicKey,
      recipientDisplayName,
    } = this.state

    const recipientPublicKey = this.props.navigation.getParam(
      'recipientPublicKey',
    )

    if (messages === null) {
      return <ActivityIndicator />
    }

    if (ownPublicKey === null) {
      return <ActivityIndicator />
    }

    /** @type {GiftedChatUser} */
    const ownUser = {
      _id: ownPublicKey,
      name: typeof ownDisplayName === 'string' ? ownDisplayName : ownPublicKey,
    }

    /** @type {GiftedChatUser} */
    const recipientUser = {
      _id: recipientPublicKey,
      name:
        typeof recipientDisplayName === 'string'
          ? recipientDisplayName
          : recipientPublicKey,
    }

    const sortedMessages = messages.slice().sort(byTimestampFromOldestToNewest)

    if (sortedMessages.length === 0) {
      return <Loading />
    }

    const firstMsg = sortedMessages[0]

    const thereAreMoreMessages =
      firstMsg.body !== '$$__SHOCKWALLET__INITIAL__MESSAGE'

    /** @type {GiftedChatMessage[]} */
    const giftedChatMsgs = sortedMessages
      .filter(msg => msg.body !== '$$__SHOCKWALLET__INITIAL__MESSAGE')
      .map(msg => {
        return {
          _id: msg.id,
          text: msg.body,
          createdAt: msg.timestamp,
          user: msg.outgoing ? ownUser : recipientUser,
        }
      })

    return (
      <GiftedChat
        isLoadingEarlier={thereAreMoreMessages}
        loadEarlier={thereAreMoreMessages}
        messages={giftedChatMsgs}
        renderLoading={Loading}
        renderMessage={this.messageRenderer}
        renderSend={SendRenderer}
        user={ownUser}
        onSend={this.onSend}
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
