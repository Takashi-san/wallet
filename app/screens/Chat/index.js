/**
 * @prettier
 */
import React from 'react'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}, Params>} Navigation
 */

import * as API from '../../services/contact-api'
import * as Wallet from '../../services/wallet'
import { Colors } from '../../css'

import { WALLET_OVERVIEW } from '../WalletOverview'

import ChatView from './View'

import MOCK from '../MOCK'

export const CHAT_ROUTE = 'CHAT_ROUTE'

/**
 * @typedef {object} Params
 * @prop {string} recipientPublicKey
 */

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {import('./View').PaymentStatus} PaymentStatus
 */

/**
 * Both outgoing and incoming invoices.
 * @typedef {object} DecodedInvoice
 * @prop {number} amount
 * @prop {number} expiryDate UNIX time.
 */

/**
 * @typedef {object} State
 * @prop {API.Schema.ChatMessage[]} messages
 * @prop {string|null} ownDisplayName
 * @prop {string|null} ownPublicKey
 * @prop {Partial<Record<string, PaymentStatus>>} rawInvoiceToPaymentStatus
 * @prop {Partial<Record<string, DecodedInvoice>>} rawInvoiceToDecodedInvoice
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
      headerStyle: {
        backgroundColor: Colors.BLUE_DARK,
        elevation: 0,
      },

      headerTintColor: Colors.TEXT_WHITE,

      title,
    }
  }

  mounted = false

  /** @type {State} */
  state = {
    messages: [],
    rawInvoiceToDecodedInvoice: {},
    rawInvoiceToPaymentStatus: {},
    ownDisplayName: null,
    ownPublicKey: null,
    recipientDisplayName: null,
  }

  decodeIncomingInvoices() {
    const rawIncomingInvoices = this.state.messages
      .filter(m => !m.outgoing)
      .filter(m => m.body.indexOf('$$__SHOCKWALLET__INVOICE__') === 0)
      .map(m => m.body.slice('$$__SHOCKWALLET__INVOICE__'.length))

    const notDecoded = rawIncomingInvoices.filter(
      i => !this.state.rawInvoiceToDecodedInvoice[i],
    )

    notDecoded.forEach(rawInvoice => {
      Wallet.decodeInvoice({
        pay_req: rawInvoice,
      }).then(decodedInvoice => {
        if (!this.mounted) {
          return
        }

        this.setState(({ rawInvoiceToDecodedInvoice }) => ({
          rawInvoiceToDecodedInvoice: {
            ...rawInvoiceToDecodedInvoice,
            [rawInvoice]: {
              amount: decodedInvoice.num_satoshis,
              expiryDate:
                decodedInvoice.timestamp + decodedInvoice.expiry * 1000,
            },
          },
        }))
      })
    })
  }

  async fetchOutgoingInvoicesAndUpdateInfo() {
    const { entries: invoices } = await Wallet.listInvoices({
      itemsPerPage: 1000,
      page: 1,
    })

    if (!this.mounted) {
      return
    }

    this.setState(
      ({
        messages,
        rawInvoiceToDecodedInvoice: oldRawInvoiceToDecodedInvoice,
        rawInvoiceToPaymentStatus: oldRawInvoiceToPaymentStatus,
      }) => {
        const rawOutgoingInvoices = messages
          .filter(m => m.outgoing)
          .filter(m => m.body.indexOf('$$__SHOCKWALLET__INVOICE__') === 0)
          .map(m => m.body.slice('$$__SHOCKWALLET__INVOICE__'.length))

        const outgoingInvoices = invoices.filter(invoice =>
          rawOutgoingInvoices.includes(invoice.payment_request),
        )

        /** @type {State['rawInvoiceToPaymentStatus']} */
        const rawInvoiceToPaymentStatus = {}

        outgoingInvoices.forEach(invoice => {
          rawInvoiceToPaymentStatus[invoice.payment_request] = invoice.settled
            ? 'PAID'
            : 'UNPAID'
        })

        /** @type {State['rawInvoiceToDecodedInvoice']} */
        const rawInvoiceToDecodedInvoice = {}

        outgoingInvoices.forEach(invoice => {
          rawInvoiceToDecodedInvoice[invoice.payment_request] = {
            amount: invoice.value,
            expiryDate: invoice.creation_date + invoice.expiry * 1000,
          }
        })

        return {
          rawInvoiceToDecodedInvoice: {
            ...oldRawInvoiceToDecodedInvoice,
            ...rawInvoiceToDecodedInvoice,
          },
          rawInvoiceToPaymentStatus: {
            ...oldRawInvoiceToPaymentStatus,
            ...rawInvoiceToPaymentStatus,
          },
        }
      },
    )
  }

  async fetchPaymentsAndUpdatePaymentStatus() {
    const { content: payments } = await Wallet.listPayments({
      itemsPerPage: 1000,
      page: 1,
      paginate: true,
    })

    if (!this.mounted) {
      return
    }

    const rawIncomingInvoices = this.state.messages
      .filter(m => !m.outgoing)
      .filter(m => m.body.indexOf('$$__SHOCKWALLET__INVOICE__') === 0)
      .map(m => m.body.slice('$$__SHOCKWALLET__INVOICE__'.length))

    /** @type {State['rawInvoiceToPaymentStatus']} */
    const rawInvoiceToPaymentStatus = {}

    rawIncomingInvoices.forEach(rawInvoice => {
      const payment = payments.find(
        payment => payment.payment_request === rawInvoice,
      )

      if (payment) {
        switch (payment.status) {
          case 0:
            rawInvoiceToPaymentStatus[rawInvoice] = 'UNKNOWN'
            break
          case 1:
            rawInvoiceToPaymentStatus[rawInvoice] = 'IN_FLIGHT'
            break
          case 2:
            rawInvoiceToPaymentStatus[rawInvoice] = 'PAID'
            break
          case 3:
            rawInvoiceToPaymentStatus[rawInvoice] = 'FAILED'
            break
        }
      } else {
        rawInvoiceToPaymentStatus[rawInvoice] = 'UNPAID'
      }
    })

    this.setState(
      ({ rawInvoiceToPaymentStatus: oldRawInvoiceToPaymentStatus }) => ({
        rawInvoiceToPaymentStatus: {
          ...oldRawInvoiceToPaymentStatus,
          ...rawInvoiceToPaymentStatus,
        },
      }),
    )
  }

  /**
   * @param {never} _
   * @param {State} prevState
   */
  componentDidUpdate(_, prevState) {
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

    if (prevState.messages !== this.state.messages) {
      this.decodeIncomingInvoices()
    }

    // TODO: If someone sets their display name to their public key, app will
    // crash
    if (oldTitle === recipientPK && recipientDisplayName) {
      navigation.setParams({
        // @ts-ignore
        title: recipientDisplayName,
      })
    }
  }

  componentDidMount() {
    // this.authUnsub = API.Events.onAuth(this.onAuth)
    // this.chatsUnsub = API.Events.onChats(this.onChats)
    // this.displayNameUnsub = API.Events.onDisplayName(displayName => {
    //   this.setState({
    //     ownDisplayName: displayName,
    //   })
    // })

    this.mounted = true

    const chats = MOCK.chats
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
      ownPublicKey: 'ownPublicKey',
    })

    this.decodeIncomingInvoices()
    this.fetchOutgoingInvoicesAndUpdateInfo()
    this.fetchPaymentsAndUpdatePaymentStatus()
  }

  componentWillUnmount() {
    this.mounted = false
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
   * @param {string} text
   * @returns {void}
   */
  onSend = text => {
    API.Actions.sendMessage(
      this.props.navigation.getParam('recipientPublicKey'),
      text,
    )
  }

  /**
   * @private
   * @param {string} msgID
   */
  onPressUnpaidIncomingInvoice = msgID => {
    this.props.navigation.navigate(WALLET_OVERVIEW)
  }

  render() {
    const {
      messages,
      ownDisplayName,
      ownPublicKey,
      recipientDisplayName,
      rawInvoiceToDecodedInvoice,
      rawInvoiceToPaymentStatus,
    } = this.state

    const recipientPublicKey = this.props.navigation.getParam(
      'recipientPublicKey',
    )

    const msgIDToInvoiceAmount = (() => {
      /** @type {import('./View').Props['msgIDToInvoiceAmount']} */
      const o = {}

      for (const [rawInvoice, decoded] of Object.entries(
        rawInvoiceToDecodedInvoice,
      )) {
        const msg = messages.find(msg => msg.body.indexOf(rawInvoice) > 0)

        if (!msg) {
          break
        }

        o[msg.id] = /** @type {DecodedInvoice} */ (decoded).amount
      }

      return o
    })()

    const msgIDToInvoiceExpiryDate = (() => {
      /** @type {import('./View').Props['msgIDToInvoiceExpiryDate']} */
      const o = {}

      for (const [rawInvoice, decoded] of Object.entries(
        rawInvoiceToDecodedInvoice,
      )) {
        const msg = messages.find(msg => msg.body.indexOf(rawInvoice) > 0)

        if (!msg) {
          break
        }

        o[msg.id] = /** @type {DecodedInvoice} */ (decoded).expiryDate
      }

      return o
    })()

    const msgIDToInvoicePaymentStatus = (() => {
      /** @type {import('./View').Props['msgIDToInvoicePaymentStatus']} */
      const o = {}

      for (const [rawInvoice, paymentStatus] of Object.entries(
        rawInvoiceToPaymentStatus,
      )) {
        const msg = messages.find(msg => msg.body.indexOf(rawInvoice) > 0)

        if (!msg) {
          break
        }

        if (typeof paymentStatus === 'undefined') {
          break
        }

        o[msg.id] = paymentStatus
      }

      return o
    })()

    return (
      <ChatView
        msgIDToInvoiceAmount={msgIDToInvoiceAmount}
        msgIDToInvoiceExpiryDate={msgIDToInvoiceExpiryDate}
        msgIDToInvoicePaymentStatus={msgIDToInvoicePaymentStatus}
        messages={messages}
        onPressUnpaidIncomingInvoice={this.onPressUnpaidIncomingInvoice}
        onSendMessage={this.onSend}
        ownDisplayName={ownDisplayName}
        ownPublicKey={ownPublicKey}
        recipientDisplayName={recipientDisplayName}
        recipientPublicKey={recipientPublicKey}
      />
    )
  }
}
