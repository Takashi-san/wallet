/**
 * @prettier
 */
import React from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import moment from 'moment'
import { Divider, Icon } from 'react-native-elements'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

import UserDetail from '../components/UserDetail'
import * as API from '../services/contact-api'
import { Colors, SCREEN_PADDING } from '../css'

export const CHATS_ROUTE = 'CHATS_ROUTE'

/**
 * @typedef {import('./Chat').Params} ChatParams
 */

/**
 * @param {{ timestamp: number }} a
 * @param {{ timestamp: number }} b
 * @returns {number}
 */
const byTimestampFromOldestToNewest = (a, b) => a.timestamp - b.timestamp

const NoChatsOrRequests = React.memo(() => <Text>NO CHATS OR REQUESTS</Text>)

/**
 * @param {API.Schema.Chat | API.Schema.SimpleReceivedRequest | API.Schema.SimpleSentRequest} item
 * @returns {string}
 */
const keyExtractor = item => {
  if (API.Schema.isChat(item)) {
    return item.recipientPublicKey
  } else {
    return item.id
  }
}

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {object} State
 * @prop {API.Schema.Chat[] | null} chats
 * @prop {API.Schema.SimpleReceivedRequest[] | null} receivedRequests
 * @prop {API.Schema.SimpleSentRequest[] | null} sentRequests
 */

/**
 * Add the last message's id of a chat to this set when opening. This will
 * simulate read status.
 * @type {Set<string>}
 */
const readMsgs = new Set()

/**
 * @augments React.PureComponent<Props, State>
 */
export default class Chats extends React.PureComponent {
  mounted = false

  /**
   * Gun has no unsubscribing. Keep track so we don't re-subscribe on re-mount
   */
  listenersAssigned = false

  /** @type {State} */
  state = {
    chats: null,
    receivedRequests: [],
    sentRequests: [],
  }

  componentDidMount() {
    this.mounted = true

    if (!this.listenersAssigned) {
      this.listenersAssigned = true

      try {
        API.Events.onChats(this.onChats)
        API.Events.onSimplerReceivedRequests(this.onReceivedRequests)
        API.Events.onSimplerSentRequests(this.onSentRequests)
      } catch (e) {
        console.warn(e.message)
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  /**
   * @param {API.Schema.SimpleReceivedRequest[]} receivedRequests
   */
  onReceivedRequests = receivedRequests => {
    if (this.mounted) {
      this.setState({
        receivedRequests,
      })
    }
  }

  /**
   * @param {API.Schema.SimpleSentRequest[]} sentRequests
   */
  onSentRequests = sentRequests => {
    if (this.mounted) {
      this.setState({
        sentRequests,
      })
    }
  }

  /**
   * @param {API.Schema.Chat[]} chats
   */
  onChats = chats => {
    if (this.mounted) {
      this.setState({
        chats,
      })
    }
  }

  /**
   * @param {string} recipientPublicKey
   */
  onPressChat = recipientPublicKey => {
    console.warn('here')
    // CAST: If user is pressing on a chat, chats are loaded and not null.
    // TS wants the expression to be casted to `unknown` first. Not possible
    // with jsdoc
    //  @ts-ignore
    const chats = /** @type  {API.Schema.Chat[]} */ (this.state.chats)

    // CAST: If user is pressing on a chat, that chat exists
    const { messages } = /** @type {API.Schema.Chat} */ (chats.find(
      chat => chat.recipientPublicKey === recipientPublicKey,
    ))

    const sortedMessages = messages.slice().sort(byTimestampFromOldestToNewest)

    const lastMsg = sortedMessages[sortedMessages.length - 1]

    if (typeof lastMsg === 'undefined') {
      throw new TypeError()
    }

    readMsgs.add(lastMsg.id)

    /** @type {ChatParams} */
    const params = {
      recipientPublicKey,
    }

    this.props.navigation.navigate('chat', params)
  }

  /**
   * @param {string} receivedRequestID
   */
  onPressReceivedRequest = receivedRequestID => {
    API.Actions.acceptRequest(receivedRequestID)
      .then(() => {
        console.warn('accepted successfully')
      })
      .catch(e => {
        console.warn(e)
      })
  }

  /**
   * @param {API.Schema.Chat} chat
   * @returns {React.ReactElement<any> | null}
   */
  chatRenderer = chat => {
    const lastMsg = chat.messages[chat.messages.length - 1]

    if (typeof lastMsg === 'undefined') {
      throw new TypeError()
    }

    const lastMsgTimestamp = lastMsg.timestamp

    const unread = !readMsgs.has(lastMsg.id)

    return (
      <View style={styles.itemContainer}>
        <View style={styles.userDetailContainer}>
          <UserDetail
            alternateText={`(${moment(lastMsgTimestamp).fromNow()})`}
            alternateTextBold={unread}
            id={chat.recipientPublicKey}
            image={chat.recipientAvatar}
            lowerText={lastMsg.body}
            lowerTextStyle={unread ? styles.boldFont : undefined}
            name={
              chat.recipientDisplayName === null
                ? chat.recipientPublicKey
                : chat.recipientDisplayName
            }
            nameBold={unread}
            onPress={this.onPressChat}
          />
        </View>
        <Icon
          color={Colors.ORANGE}
          name="chevron-right"
          size={28}
          type="font-awesome"
        />
      </View>
    )
  }

  /**
   * @param {API.Schema.SimpleReceivedRequest} receivedRequest
   * @returns {React.ReactElement<any>}
   */
  receivedRequestRenderer = receivedRequest => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.userDetailContainer}>
          <UserDetail
            alternateText={`(${moment(receivedRequest.timestamp).fromNow()})`}
            alternateTextBold
            id={receivedRequest.id}
            image={receivedRequest.requestorAvatar}
            lowerText="Wants to contact you"
            lowerTextStyle={styles.boldFont}
            name={
              receivedRequest.requestorDisplayName === null
                ? receivedRequest.requestorPK
                : receivedRequest.requestorDisplayName
            }
            nameBold
            onPress={this.onPressReceivedRequest}
          />
        </View>
        <Icon
          color={Colors.ORANGE}
          name="chevron-right"
          size={28}
          type="font-awesome"
        />
      </View>
    )
  }

  /**
   * @param {API.Schema.SimpleSentRequest} sentRequest
   * @returns {React.ReactElement<any>}
   */
  sentRequestRenderer = sentRequest => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.userDetailContainer}>
          <UserDetail
            alternateText={`(${moment(sentRequest.timestamp).fromNow()})`}
            alternateTextBold
            id={sentRequest.id}
            image={sentRequest.recipientAvatar}
            lowerText={
              sentRequest.recipientChangedRequestAddress
                ? 'Request ignored'
                : 'Pending acceptance'
            }
            lowerTextStyle={styles.boldFont}
            name={
              sentRequest.recipientDisplayName === null
                ? sentRequest.recipientPublicKey
                : sentRequest.recipientDisplayName
            }
            nameBold
          />
        </View>
        <Icon
          color={Colors.ORANGE}
          name="chevron-right"
          size={28}
          type="font-awesome"
        />
      </View>
    )
  }

  /**
   * @param {{ item: API.Schema.Chat|API.Schema.SimpleReceivedRequest|API.Schema.SimpleSentRequest }} args
   * @returns {React.ReactElement<any> | null}
   */
  itemRenderer = ({ item }) => {
    if (API.Schema.isChat(item)) {
      return this.chatRenderer(item)
    }

    if (API.Schema.isSimpleSentRequest(item)) {
      return this.sentRequestRenderer(item)
    }

    if (API.Schema.isSimpleReceivedRequest(item)) {
      return this.receivedRequestRenderer(item)
    }

    console.warn('unknown kind of item found')
    console.warn(JSON.stringify(item))

    return null
  }

  render() {
    const { chats, receivedRequests, sentRequests } = this.state

    if (chats === null || receivedRequests === null || sentRequests === null) {
      return <ActivityIndicator />
    }

    const items = [...chats, ...receivedRequests, ...sentRequests]

    items.sort((a, b) => {
      /** @type {number} */
      let at

      /** @type {number} */
      let bt

      if (API.Schema.isChat(a)) {
        const sortedMessages = a.messages
          .slice()
          .sort(byTimestampFromOldestToNewest)

        const lastMsg = sortedMessages[sortedMessages.length - 1]

        if (typeof lastMsg === 'undefined') {
          throw new TypeError()
        }

        at = lastMsg.timestamp
      } else {
        at = a.timestamp
      }

      if (API.Schema.isChat(b)) {
        const sortedMessages = b.messages
          .slice()
          .sort(byTimestampFromOldestToNewest)

        const lastMsg = sortedMessages[sortedMessages.length - 1]

        if (typeof lastMsg === 'undefined') {
          throw new TypeError()
        }

        bt = lastMsg.timestamp
      } else {
        bt = b.timestamp
      }

      return at - bt
    })

    return (
      <FlatList
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Divider}
        data={items}
        keyExtractor={keyExtractor}
        renderItem={this.itemRenderer}
        style={styles.list}
        ListEmptyComponent={NoChatsOrRequests}
      />
    )
  }
}

const ITEM_CONTAINER_HORIZONTAL_PADDING = SCREEN_PADDING / 2
const ITEM_CONTAINER_VERTICAL_PADDING = 15

/**
 * @type {Record<string, import('react-native').ViewStyle>}
 */
const styles = {
  boldFont: {
    fontWeight: 'bold',
  },

  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: ITEM_CONTAINER_VERTICAL_PADDING,
    paddingLeft: ITEM_CONTAINER_HORIZONTAL_PADDING,
    paddingRight: ITEM_CONTAINER_HORIZONTAL_PADDING,
    paddingTop: ITEM_CONTAINER_VERTICAL_PADDING,
  },

  list: {
    flex: 1,
  },

  userDetailContainer: {
    flex: 1,
    marginRight: 20,
  },
}
