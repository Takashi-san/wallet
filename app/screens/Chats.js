/**
 * @prettier
 */
import React from 'react'
import { ActivityIndicator, FlatList, Text, View, Button } from 'react-native'
import moment from 'moment'
import { Divider, Icon } from 'react-native-elements'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

import * as API from '../services/contact-api'
import UserDetail from '../components/UserDetail'
import { Colors, SCREEN_PADDING } from '../css'
import ShockButton from '../components/ShockButton'
import ShockDialog from '../components/ShockDialog'
import { CHAT_ROUTE } from './Chat'

const ACCEPT_REQUEST_DIALOG_TEXT =
  'By accepting this request, this user will be able to send you messages. You can block the user from sending further messages down the line if you wish so.'
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

/**
 * @type {React.FC<{ onPressGoToUsers: () => void }>}
 */
const NoChatsOrRequests = React.memo(({ onPressGoToUsers }) => ((
  <View style={styles.noChats}>
    <Text>NO CHATS OR REQUESTS</Text>
    <ShockButton onPress={onPressGoToUsers} title="See List Of Users" />
  </View>
)))

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
 * @prop {string|null} acceptingRequest
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
  /**
   * @type {import('react-navigation').NavigationStackScreenOptions}
   */
  static navigationOptions = {
    header: null,
  }

  /** @type {State} */
  state = {
    acceptingRequest: null,
    chats: null,
    receivedRequests: null,
    sentRequests: null,
  }

  /**
   * @private
   * @type {Record<string, () => void>}
   */
  choiceToHandler = {
    Accept: () => {
      API.Actions.acceptRequest(
        /** @type {string} */ (this.state.acceptingRequest),
      )

      this.setState({
        acceptingRequest: null,
      })
    },
    Ignore: () => {
      this.setState({
        acceptingRequest: null,
      })
    },
  }

  chatsUnsubscribe = () => {}
  receivedReqsUnsubscribe = () => {}
  sentReqsUnsubscribe = () => {}

  componentDidMount() {
    this.chatsUnsubscribe = API.Events.onChats(this.onChats)
    this.receivedReqsUnsubscribe = API.Events.onReceivedRequests(
      this.onReceivedRequests,
    )
    this.sentReqsUnsubscribe = API.Events.onSentRequests(this.onSentRequests)
  }

  componentWillUnmount() {
    this.chatsUnsubscribe()
    this.receivedReqsUnsubscribe()
    this.sentReqsUnsubscribe()
  }

  /**
   * @param {API.Schema.Chat[]} chats
   */
  onChats = chats => {
    this.setState({
      chats,
    })
  }

  /**
   * @param {API.Schema.SimpleReceivedRequest[]} receivedRequests
   */
  onReceivedRequests = receivedRequests => {
    console.warn('onReceivedRequests')
    this.setState({
      receivedRequests,
    })
  }

  /**
   * @param {API.Schema.SimpleSentRequest[]} sentRequests
   */
  onSentRequests = sentRequests => {
    this.setState({
      sentRequests,
    })
  }

  /**
   * @param {string} recipientPublicKey
   */
  onPressChat = recipientPublicKey => {
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

    this.props.navigation.navigate(CHAT_ROUTE, params)
  }
  ////////////////////////////////////////////////////////////////////////////////
  /**
   * @private
   * @param {string} receivedRequestID
   * @returns {void}
   */
  onPressReceivedRequest = receivedRequestID => {
    this.setState({
      acceptingRequest: receivedRequestID,
    })
  }

  /**
   * @private
   * @returns {void}
   */
  cancelAcceptingRequest = () => {
    this.setState({
      acceptingRequest: null,
    })
  }

  ////////////////////////////////////////////////////////////////////////////////
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

    const unread =
      lastMsg.body !== '$$__SHOCKWALLET__INITIAL__MESSAGE' &&
      !readMsgs.has(lastMsg.id)

    return (
      <View style={styles.itemContainer}>
        <View style={styles.userDetailContainer}>
          <UserDetail
            alternateText={`(${moment(lastMsgTimestamp).fromNow()})`}
            alternateTextBold={unread}
            id={chat.recipientPublicKey}
            image={chat.recipientAvatar}
            lowerText={
              lastMsg.body === '$$__SHOCKWALLET__INITIAL__MESSAGE'
                ? 'Empty conversation'
                : lastMsg.body
            }
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
   * @private
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

  /**
   * @private
   */
  onPressGoToUsers = () => {
    this.props.navigation.navigate('Users')
  }

  logout = () => {
    API.Actions.logout()
  }

  render() {
    const {
      acceptingRequest,
      chats,
      receivedRequests,
      sentRequests,
    } = this.state

    if (chats === null || receivedRequests === null || sentRequests === null) {
      return (
        <View>
          <Button onPress={this.logout} title="Logout" />
          <ActivityIndicator />
        </View>
      )
    }

    const items = [...chats, ...receivedRequests, ...sentRequests]

    if (items.length === 0) {
      return (
        <View style={styles.flex}>
          <Button onPress={this.logout} title="Logout" />

          <NoChatsOrRequests onPressGoToUsers={this.onPressGoToUsers} />
        </View>
      )
    }

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
      <React.Fragment>
        <FlatList
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={Divider}
          data={items}
          ListHeaderComponent={() => (
            <Button onPress={this.logout} title="Logout" />
          )}
          keyExtractor={keyExtractor}
          renderItem={this.itemRenderer}
          style={styles.list}
        />

        <NoChatsOrRequests onPressGoToUsers={this.onPressGoToUsers} />

        <ShockDialog
          choiceToHandler={this.choiceToHandler}
          message={ACCEPT_REQUEST_DIALOG_TEXT}
          visible={!!acceptingRequest}
        />
      </React.Fragment>
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
    // @ts-ignore
    fontWeight: 'bold',
  },

  flex: {
    flex: 1,
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

  noChats: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  userDetailContainer: {
    flex: 1,
    marginRight: 20,
  },
}
