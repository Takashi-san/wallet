/**
 * @prettier
 */
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
 * @prop {API.Schema.ChatMessage[]} messages
 * @prop {string|null} recipientDisplayName
 * @prop {string|null} ownDisplayName
 */

/**
 * @augments React.PureComponent<Props, State>
 */
export default class Chat extends React.PureComponent {
  mounted = false
  /**
   * Gun has no unsubscribing. Keep track so we don't re-subscribe on re-mount
   */
  listenersAssigned = false

  /** @type {State} */
  state = {
    messages: [],
    recipientDisplayName: null,
    ownDisplayName: null,
  }

  /**
   * @private
   * @returns {string|null}
   */
  getRecipientPublicKeyParamIfExists() {
    const { navigation } = this.props

    const recipientPublicKey = navigation.getParam('recipientPublicKey')

    if (typeof recipientPublicKey !== 'string') {
      console.error(
        `Expected recipientPublicKey parameter to be of type string, instead got: ${typeof recipientPublicKey}`,
      )
      return null
    }

    if (recipientPublicKey.length === 0) {
      console.error(
        `Expected recipientPublicKey parameter to have a non-zero length`,
      )

      return null
    }

    return recipientPublicKey
  }

  /**
   * @private
   * @returns {string|null}
   */
  getOwnPublicKey() {
    const ownPublicKey = API.Gun.user._.sea && API.Gun.user._.sea

    if (typeof ownPublicKey !== 'string') {
      console.error(
        `Expected ownPublicKey obtained from SEA to be of type string, instead got: ${typeof ownPublicKey}`,
      )

      return null
    }

    if (ownPublicKey.length === 0) {
      console.error(`Expected ownPublicKey obtained from SEA to have a length`)

      return null
    }

    return ownPublicKey
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

    const recipientPublicKey = this.getRecipientPublicKeyParamIfExists()

    if (recipientPublicKey === null) {
      return null
    }

    const ownPublicKey = this.getOwnPublicKey()

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

  componentDidMount() {
    this.mounted = true

    if (!this.listenersAssigned) {
      this.listenersAssigned = true
      API.Events.onChats(this.onChats)
      API.Events.onDisplayName(this.onDisplayName)
    }
  }

  /**
   * @private
   * @param {string|null} displayName
   * @returns {void}
   */
  onDisplayName = displayName => {
    if (this.mounted) {
      this.setState({
        ownDisplayName: displayName,
      })
    }
  }

  /**
   * @private
   * @param {API.Schema.Chat[]} chats
   * @returns {void}
   */
  onChats = chats => {
    const { navigation } = this.props

    const recipientPublicKey = navigation.getParam('recipientPublicKey')

    if (typeof recipientPublicKey !== 'string') {
      console.error(
        `Expected recipientPublicKey parameter to be of type string, instead got: ${typeof recipientPublicKey}`,
      )
      return
    }

    if (recipientPublicKey.length === 0) {
      console.error(
        `Expected recipientPublicKey parameter to have a length greater than 0`,
      )
      return
    }

    if (chats.length === 0) {
      console.warn(
        'No chats found, this can happen sometimes when gun is lagging on its data, and subsequent calls should contain chats.',
      )
      return
    }

    const theChat = chats.find(
      chat => chat.recipientPublicKey === recipientPublicKey,
    )

    if (typeof theChat === 'undefined') {
      console.warn(
        'No chat with the recipientPublicKey parameter found, this can happen sometimes when gun is lagging on its data, and subsequent calls should contain the chat.',
      )
      return
    }

    if (!this.mounted) {
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

  render() {
    const { navigation } = this.props
    const { messages, ownDisplayName, recipientDisplayName } = this.state

    const ownPublicKey = this.getOwnPublicKey()
    const recipientPublicKey = this.getRecipientPublicKeyParamIfExists()

    if (ownPublicKey === null) {
      return <Text>ownPublicKey Error</Text>
    }

    if (recipientPublicKey === null) {
      return <Text>recipientPublicKey error</Text>
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

    const thereAreMoreMessages = firstMsg.body !== API.Actions.INITIAL_MSG

    /** @type {GiftedChatMessage[]} */
    const giftedChatMsgs = sortedMessages.map(msg => {
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
