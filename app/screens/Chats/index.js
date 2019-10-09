/**
 * @prettier
 */
import React from 'react'
import EntypoIcons from 'react-native-vector-icons/Entypo'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

import * as API from '../../services/contact-api'
import { CHAT_ROUTE } from './../Chat'

import ChatsView from './View'

export const CHATS_ROUTE = 'CHATS_ROUTE'
/**
 * @typedef {import('../Chat').Params} ChatParams
 */

/**
 * @param {{ timestamp: number }} a
 * @param {{ timestamp: number }} b
 * @returns {number}
 */
const byTimestampFromOldestToNewest = (a, b) => a.timestamp - b.timestamp

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {object} State
 * @prop {string|null} acceptingRequest
 * @prop {API.Schema.Chat[]} chats
 * @prop {API.Schema.SimpleReceivedRequest[]} receivedRequests
 * @prop {API.Schema.SimpleSentRequest[]} sentRequests
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
   * @type {import('react-navigation').NavigationBottomTabScreenOptions}
   */
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => {
      return ((
        <EntypoIcons
          color={tintColor === null ? undefined : tintColor}
          name="chat"
          // reverseColor={'#CED0CE'}
          size={22}
        />
      ))
    },
  }

  /** @type {State} */
  state = {
    acceptingRequest: null,
    chats: [
      {
        messages: [
          {
            body: '$$__SHOCKWALLET__INITIAL__MESSAGE',
            id: Math.random().toString(),
            outgoing: false,
            timestamp: Date.now(),
          },
        ],
        recipientAvatar: null,
        recipientDisplayName: 'Jhon Appleseed',
        recipientPublicKey: 'recipientpk',
      },
      {
        messages: [
          {
            body: 'Hello',
            id: Math.random().toString(),
            outgoing: false,
            timestamp: Date.now(),
          },
        ],
        recipientAvatar:
          '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',
        recipientDisplayName: null,
        recipientPublicKey: 'recipientpk',
      },
    ],
    receivedRequests: [
      {
        id: Math.random().toString(),
        requestorAvatar:
          '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',
        requestorDisplayName: null,
        requestorPK: 'requestor_pk',
        response: 'response',
        timestamp: Date.now(),
      },

      {
        id: Math.random().toString(),
        requestorAvatar: null,
        requestorDisplayName: 'Mary',
        requestorPK: 'Mary',
        response: 'response',
        timestamp: Date.now(),
      },
    ],
    sentRequests: [
      {
        id: Math.random().toString(),
        recipientAvatar:
          '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',
        recipientDisplayName: null,
        recipientPublicKey: 'recipientPublicKey',
        recipientChangedRequestAddress: false,
        timestamp: Date.now(),
      },
      {
        id: Math.random().toString(),
        recipientAvatar: null,
        recipientDisplayName: 'Joe',
        recipientPublicKey: 'recipientPublicKey',
        recipientChangedRequestAddress: false,
        timestamp: Date.now(),
      },
    ],
  }

  chatsUnsubscribe = () => {}
  receivedReqsUnsubscribe = () => {}
  sentReqsUnsubscribe = () => {}

  componentDidMount() {
    // this.chatsUnsubscribe = API.Events.onChats(chats => {
    //   this.setState({
    //     chats,
    //   })
    // })
    // this.receivedReqsUnsubscribe = API.Events.onReceivedRequests(
    //   receivedRequests => {
    //     this.setState({
    //       receivedRequests,
    //     })
    //   },
    // )
    // this.sentReqsUnsubscribe = API.Events.onSentRequests(sentRequests => {
    //   this.setState({
    //     sentRequests,
    //   })
    // })
  }

  componentWillUnmount() {
    this.chatsUnsubscribe()
    this.receivedReqsUnsubscribe()
    this.sentReqsUnsubscribe()
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

  acceptRequest = () => {
    const { acceptingRequest } = this.state

    if (acceptingRequest === null) {
      console.warn('acceptingRequest === null')
      return
    }

    API.Actions.acceptRequest(acceptingRequest)

    this.setState({
      acceptingRequest: null,
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

  render() {
    const {
      acceptingRequest,
      chats,
      receivedRequests,
      sentRequests,
    } = this.state

    return (
      <ChatsView
        acceptingRequest={!!acceptingRequest}
        chats={chats}
        receivedRequests={receivedRequests}
        sentRequests={sentRequests}
        onPressAcceptRequest={this.acceptRequest}
        onPressIgnoreRequest={this.cancelAcceptingRequest}
        onPressChat={this.onPressChat}
        onPressRequest={this.onPressReceivedRequest}
      />
    )
  }
}
