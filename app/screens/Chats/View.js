/**
 * @prettier
 */
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import moment from 'moment'
import { Divider, Icon } from 'react-native-elements'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

import * as API from '../../services/contact-api'
import UserDetail from '../../components/UserDetail'
import { Colors, SCREEN_PADDING } from '../../css'
import ShockDialog from '../../components/ShockDialog'

const ACCEPT_REQUEST_DIALOG_TEXT =
  'By accepting this request, this user will be able to send you messages. You can block the user from sending further messages down the line if you wish so.'
export const CHATS_ROUTE = 'CHATS_ROUTE'
/**
 * @typedef {import('.././Chat').Params} ChatParams
 */

/**
 * @param {{ timestamp: number }} a
 * @param {{ timestamp: number }} b
 * @returns {number}
 */
const byTimestampFromOldestToNewest = (a, b) => a.timestamp - b.timestamp

/**
 * @type {React.FC}
 */
const NoChatsOrRequests = React.memo(() => ((
  <View style={styles.noChats}>
    <Text>NO CHATS OR REQUESTS</Text>
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
 * @prop {boolean} acceptingRequest True if in the process of accepting a
 * request (a dialog will pop up).
 *
 * @prop {API.Schema.Chat[]} chats
 * @prop {API.Schema.SimpleReceivedRequest[]} receivedRequests
 * @prop {API.Schema.SimpleSentRequest[]} sentRequests
 *
 * @prop {(recipientPublicKey: string) => void} onPressChat
 * @prop {(requestID: string) => void} onPressRequest
 *
 * @prop {() => void} onPressAcceptRequest
 * @prop {() => void} onPressIgnoreRequest
 */

/**
 * @augments React.PureComponent<Props>
 */
export default class ChatsView extends React.PureComponent {
  /**
   * @private
   * @type {Record<string, () => void>}
   */
  choiceToHandler = {
    Accept: () => {
      this.props.onPressAcceptRequest()
    },
    Ignore: () => {
      this.props.onPressIgnoreRequest()
    },
  }

  /**
   * @private
   * @param {string} recipientPublicKey
   */
  onPressChat = recipientPublicKey => {
    this.props.onPressChat(recipientPublicKey)
  }

  /**
   * @private
   * @param {string} requestID
   */
  onPressRequest = requestID => {
    this.props.onPressRequest(requestID)
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

    const unread = false

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
                : lastMsg.body.indexOf('$$__SHOCKWALLET__INVOICE__') === 0
                ? 'Invoice'
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
            onPress={this.onPressRequest}
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

  render() {
    const {
      acceptingRequest,
      chats,
      receivedRequests,
      sentRequests,
    } = this.props

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
      <React.Fragment>
        <FlatList
          ItemSeparatorComponent={Divider}
          ListEmptyComponent={NoChatsOrRequests}
          data={items}
          keyExtractor={keyExtractor}
          renderItem={this.itemRenderer}
          style={styles.list}
        />

        <ShockDialog
          choiceToHandler={this.choiceToHandler}
          message={ACCEPT_REQUEST_DIALOG_TEXT}
          onRequestClose={this.props.onPressIgnoreRequest}
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

  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: ITEM_CONTAINER_VERTICAL_PADDING,
    paddingLeft: ITEM_CONTAINER_HORIZONTAL_PADDING,
    paddingRight: ITEM_CONTAINER_HORIZONTAL_PADDING,
    paddingTop: ITEM_CONTAINER_VERTICAL_PADDING,
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
