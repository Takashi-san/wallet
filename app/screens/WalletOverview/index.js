/**
 * @format
 */

import React from 'react'
import {
  ActivityIndicator,
  Clipboard,
  Dimensions,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
  Linking,
} from 'react-native'
import EntypoIcons from 'react-native-vector-icons/Entypo'
import QRCodeScanner from 'react-native-qrcode-scanner'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}, Params>} Navigation
 */

import BasicDialog from '../../components/BasicDialog'
import IGDialogBtn from '../../components/IGDialogBtn'
import Pad from '../../components/Pad'
import ShockButton from '../../components/ShockButton'
import ShockDialog from '../../components/ShockDialog'
import ShockInput from '../../components/ShockInput'
import UserDetail from '../../components/UserDetail'

import btcConvert from '../../services/convertBitcoin'
import * as Wallet from '../../services/wallet'

import QR from './QR'
import UnifiedTrx from './UnifiedTrx'

/**
 * @typedef {object} Params
 * @prop {string=} rawInvoice
 * @prop {string|null} recipientDisplayName
 * @prop {string|null} recipientAvatar
 * @prop {string} recipientPublicKey
 */

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {{ displayName: string|null , avatar: string|null, pk: string }} ShockUser
 */

/**
 * @typedef {object} State
 * @prop {number|null} USDExchangeRate Null on first fetch.
 * @prop {number|null} balance Null on first fetch.
 *
 * @prop {boolean} displayingSendDialog
 * @prop {boolean} displayingSendToBTCDialog
 * @prop {string} sendToBTCAddress
 * @prop {number} sendToBTCAmount
 * @prop {boolean} scanningBTCAddressQR
 * @prop {boolean} displayingSendBTCResultDialog
 * @prop {boolean} sendingBTC True while sending a BTC transaction is in
 * progress.
 * @prop {string|null} sentBTCErr
 * @prop {string} sentBTCTXID Holds the transaction ID after sending BTC.
 *
 * @prop {ShockUser|null} payShockInvoiceUserData
 * @prop {boolean} displayingPayLightningInvoiceDialog
 * @prop {string} lightningInvoiceInput
 * @prop {boolean} scanningLightningInvoiceQR
 * @prop {boolean} displayingConfirmInvoicePaymentDialog
 * @prop {number} invoiceAmt Only asked for if invoice has no amount embedded.
 * @prop {Wallet.DecodeInvoiceResponse|null} decodedInvoice Null when dialog is
 * closed or when fetching it.
 * @prop {boolean} displayingInvoicePaymentResult
 * @prop {boolean} payingInvoice
 *
 * @prop {number} createInvoiceAmount
 * @prop {string} createInvoiceMemo
 * @prop {boolean} displayingBTCAddress
 * @prop {boolean} displayingBTCAddressQR
 * @prop {boolean} displayingCreateInvoiceDialog
 * @prop {string} displayingCreateInvoiceDialogMemo
 * @prop {number} displayingCreateInvoiceDialogExpiryTimestamp
 * @prop {boolean} displayingCreateInvoiceResultDialog
 * @prop {boolean} displayingInvoiceQR
 * @prop {boolean} displayingOlderFormatBTCAddress
 * @prop {boolean} displayingOlderFormatBTCAddressQR
 * @prop {boolean} displayingReceiveDialog
 * @prop {boolean} fetchingBTCAddress
 * @prop {boolean} fetchingInvoice
 * @prop {boolean} fetchingOlderFormatBTCAddress
 * @prop {string|null} invoice
 * @prop {string|null} receivingOlderFormatBTCAddress
 * @prop {string|null} receivingBTCAddress
 *
 * @prop {boolean} displayingPreShockUserQRScan
 * @prop {boolean} scanningShockUserQR
 * @prop {{ name: string , hAddr: string , pk: string }|null} QRShockUserInfo
 * @prop {boolean} displayingPostShockUserQRScan
 *
 * @prop {(Wallet.Invoice|Wallet.Payment|Wallet.Transaction)[]|null} unifiedTrx
 */

const { width, height } = Dimensions.get('window')

export const WALLET_OVERVIEW = 'WALLET_OVERVIEW'

const showCopiedToClipboardToast = () => {
  ToastAndroid.show('Copied to clipboard!', 800)
}

/**
 * @augments React.PureComponent<Props, State, never>
 */
export default class WalletOverview extends React.PureComponent {
  /**
   * @type {import('react-navigation').NavigationBottomTabScreenOptions}
   */
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => {
      return ((
        <EntypoIcons
          color={tintColor === null ? undefined : tintColor}
          name="wallet"
          // reverseColor={'#CED0CE'}
          size={22}
        />
      ))
    },
  }

  /**
   * @type {State}
   */
  state = {
    USDExchangeRate: null,
    balance: null,

    displayingSendDialog: false,
    displayingSendToBTCDialog: false,
    sendToBTCAddress: '',
    sendToBTCAmount: 0,
    scanningBTCAddressQR: false,
    displayingSendBTCResultDialog: false,
    sendingBTC: false,
    sentBTCErr: null,
    sentBTCTXID: '',

    payShockInvoiceUserData: null,
    displayingPayLightningInvoiceDialog: false,
    lightningInvoiceInput: '',
    scanningLightningInvoiceQR: false,
    displayingConfirmInvoicePaymentDialog: false,
    invoiceAmt: 0,
    decodedInvoice: null,
    displayingInvoicePaymentResult: false,
    payingInvoice: false,

    createInvoiceAmount: 0,
    createInvoiceMemo: '',
    fetchingBTCAddress: false,
    fetchingOlderFormatBTCAddress: false,
    displayingBTCAddress: false,
    displayingBTCAddressQR: false,
    displayingCreateInvoiceDialog: false,
    displayingCreateInvoiceDialogExpiryTimestamp: 0,
    displayingCreateInvoiceDialogMemo: '',
    displayingCreateInvoiceResultDialog: false,
    displayingInvoiceQR: false,
    displayingOlderFormatBTCAddress: false,
    displayingOlderFormatBTCAddressQR: false,
    displayingReceiveDialog: false,
    fetchingInvoice: false,
    invoice: null,
    receivingBTCAddress: null,
    receivingOlderFormatBTCAddress: null,
    unifiedTrx: null,

    displayingPreShockUserQRScan: false,
    scanningShockUserQR: false,
    QRShockUserInfo: null,
    displayingPostShockUserQRScan: false,
  }

  closeAllSendDialogs = () => {
    this.setState({
      displayingSendDialog: false,
      displayingSendToBTCDialog: false,
      displayingSendBTCResultDialog: false,
      sendToBTCAddress: '',
      sendToBTCAmount: 0,
      scanningBTCAddressQR: false,
      sendingBTC: false,
      sentBTCErr: null,
      sentBTCTXID: '',

      payShockInvoiceUserData: null,
      displayingPayLightningInvoiceDialog: false,
      lightningInvoiceInput: '',
      scanningLightningInvoiceQR: false,
      displayingConfirmInvoicePaymentDialog: false,
      invoiceAmt: 0,
      decodedInvoice: null,
      displayingInvoicePaymentResult: false,
      payingInvoice: false,
    })
  }

  closeAllReceiveDialogs = () => {
    this.setState({
      createInvoiceAmount: 0,
      createInvoiceMemo: '',
      displayingBTCAddress: false,
      displayingBTCAddressQR: false,
      displayingCreateInvoiceDialog: false,
      displayingCreateInvoiceResultDialog: false,
      displayingCreateInvoiceDialogExpiryTimestamp: 0,
      displayingCreateInvoiceDialogMemo: '',
      displayingOlderFormatBTCAddress: false,
      displayingOlderFormatBTCAddressQR: false,
      displayingInvoiceQR: false,
      displayingReceiveDialog: false,
      fetchingBTCAddress: false,
      fetchingInvoice: false,
      fetchingOlderFormatBTCAddress: false,
      invoice: null,
      receivingBTCAddress: null,
      receivingOlderFormatBTCAddress: null,

      displayingPreShockUserQRScan: false,
      scanningShockUserQR: false,
      QRShockUserInfo: null,
      displayingPostShockUserQRScan: false,
    })
  }

  //////////////////////////////////////////////////////////////////////////////
  copyOlderFormatBTCAddressToClipboard = () => {
    const { receivingOlderFormatBTCAddress } = this.state
    if (receivingOlderFormatBTCAddress === null) {
      console.warn('receivingOlderFormatBTCAddress === null')
      return
    }

    Clipboard.setString(receivingOlderFormatBTCAddress)
    showCopiedToClipboardToast()
  }

  generateOlderFormatBTCAddressQR = () => {
    const { receivingOlderFormatBTCAddress } = this.state

    if (receivingOlderFormatBTCAddress === null) {
      return
    }

    this.setState({
      displayingOlderFormatBTCAddress: false,
      displayingOlderFormatBTCAddressQR: true,
    })
  }

  displayingOlderFormatBTCAddressChoiceToHandlerWhileFetching = {}

  displayingOlderFormatBTCAddressChoiceToHandler = {
    'Copy to Clipboard': this.copyOlderFormatBTCAddressToClipboard,
    'Generate QR': this.generateOlderFormatBTCAddressQR,
  }

  displayOlderFormatBTCAddress = () => {
    this.closeAllReceiveDialogs()

    this.setState(
      {
        fetchingOlderFormatBTCAddress: true,
        displayingOlderFormatBTCAddress: true,
      },
      () => {
        // Check in case dialog was closed before state was updated
        if (!this.state.displayingOlderFormatBTCAddress) {
          return
        }

        Wallet.newAddress(true).then(addr => {
          this.setState(({ displayingOlderFormatBTCAddress }) => {
            // Check in case dialog was closed before completing fetch.
            if (displayingOlderFormatBTCAddress) {
              return {
                fetchingOlderFormatBTCAddress: false,
                receivingOlderFormatBTCAddress: addr,
              }
            }

            return null
          })
        })
      },
    )
  }

  //////////////////////////////////////////////////////////////////////////////

  copyBTCAddressToClipboard = () => {
    const { receivingBTCAddress } = this.state

    if (receivingBTCAddress === null) {
      console.warn('receivingOlderFormatBTCAddress === null')
      return
    }

    Clipboard.setString(receivingBTCAddress)
    showCopiedToClipboardToast()
  }

  generateBTCAddressQR = () => {
    const { receivingBTCAddress } = this.state

    if (receivingBTCAddress === null) {
      return
    }

    this.setState({
      displayingBTCAddress: false,
      displayingBTCAddressQR: true,
    })
  }

  displayingBTCAddressChoiceToHandlerWhileFetching = {
    'Use older format': this.displayOlderFormatBTCAddress,
  }

  displayingBTCAddressChoiceToHandler = {
    'Copy to Clipboard': this.copyBTCAddressToClipboard,
    'Generate QR': this.generateBTCAddressQR,
    'Use older format': this.displayOlderFormatBTCAddress,
  }

  displayBTCAddress = () => {
    this.closeAllReceiveDialogs()

    this.setState(
      {
        fetchingBTCAddress: true,
        displayingBTCAddress: true,
      },
      () => {
        // Check in case dialog was closed before state was updated
        if (!this.state.displayingBTCAddress) {
          return
        }

        Wallet.newAddress(false).then(addr => {
          this.setState(({ displayingBTCAddress }) => {
            // Check in case dialog was closed before completing fetch.
            if (displayingBTCAddress) {
              return {
                fetchingBTCAddress: false,
                receivingBTCAddress: addr,
              }
            }

            return null
          })
        })
      },
    )
  }

  //////////////////////////////////////////////////////////////////////////////

  displayCreateInvoiceDialog = () => {
    this.closeAllReceiveDialogs()
    this.setState({
      displayingCreateInvoiceDialog: true,
    })
  }

  /**
   * @type {import('../../components/ShockInput').Props['onChangeText']}
   */
  createInvoiceDialogAmountOnChange = amount => {
    const numbers = '0123456789'.split('')

    const chars = amount.split('')

    if (!chars.every(c => numbers.includes(c))) {
      return
    }

    this.setState({
      createInvoiceAmount: Number(amount),
    })
  }

  /**
   * @type {import('../../components/ShockInput').Props['onChangeText']}
   */
  createInvoiceDialogMemoOnChange = memo => {
    this.setState({
      createInvoiceMemo: memo,
    })
  }

  copyInvoiceToClipboard = () => {
    const { invoice } = this.state

    if (invoice === null) {
      return
    }

    Clipboard.setString(invoice)
    showCopiedToClipboardToast()
  }

  generateInvoiceQR = () => {
    const { invoice } = this.state

    if (invoice === null) {
      return
    }

    this.setState({
      displayingCreateInvoiceResultDialog: false,
      displayingInvoiceQR: true,
    })
  }

  ///

  sendInvoiceToShockUser = () => {
    this.setState({
      displayingCreateInvoiceResultDialog: false,
      displayingPreShockUserQRScan: true,
    })
  }

  proceedToShockuserQRScan = () => {
    this.setState({
      displayingPreShockUserQRScan: false,
      scanningShockUserQR: true,
    })
  }

  preQRScanDialogChoiceToHandler = {
    Proceed: this.proceedToShockuserQRScan,
  }

  /** @type {import('react-native-qrcode-scanner').RNQRCodeScannerProps['onRead']} */
  onSuccessfulShockUserQRScan = e => {
    this.setState({
      scanningShockUserQR: false,
    })

    /** @type {string} */
    const data = e.data.slice('$$__SHOCKWALLET__USER__'.length)

    const [pk, hAddr, name] = data.split('__')

    this.setState({
      displayingPostShockUserQRScan: true,
      scanningShockUserQR: false,
      QRShockUserInfo: {
        hAddr,
        name,
        pk,
      },
    })
  }

  confirmSendToShockUser = () => {
    const { QRShockUserInfo } = this.state

    if (QRShockUserInfo === null) {
      return
    }
  }

  ///

  invoiceResultDialogChoiceToHandler = {
    'Copy to Clipboard': this.copyInvoiceToClipboard,
    'Generate QR': this.generateInvoiceQR,
    'Send to Shock Network User': this.sendInvoiceToShockUser,
  }

  onPressCreateInvoice = () => {
    if (this.state.createInvoiceAmount === 0) {
      return
    }

    this.closeAllReceiveDialogs()

    this.setState(
      {
        createInvoiceAmount: this.state.createInvoiceAmount,
        displayingCreateInvoiceResultDialog: true,
        fetchingInvoice: true,
      },
      () => {
        // Check in case dialog was closed before state was updated
        if (!this.state.displayingCreateInvoiceResultDialog) {
          return
        }

        Wallet.addInvoice({
          memo: this.state.createInvoiceMemo,
          expiry: 2,
        }).then(res => {
          this.setState(({ displayingCreateInvoiceResultDialog }) => {
            // Check in case dialog was closed before completing fetch.
            if (displayingCreateInvoiceResultDialog) {
              return {
                fetchingInvoice: false,
                invoice: res.payment_request,
              }
            }

            return null
          })
        })
      },
    )
  }

  //////////////////////////////////////////////////////////////////////////////
  // SEND BTC //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  sendToBTCAddress = () => {
    this.closeAllSendDialogs()

    this.setState({
      displayingSendToBTCDialog: true,
    })
  }

  onPressSend = () => {
    const { balance } = this.state

    if (balance === null) {
      return
    }

    this.setState({
      displayingSendDialog: true,
    })
  }

  /**
   * @param {string} addr
   */
  onChangeSendBTCAddress = addr => {
    this.setState({
      sendToBTCAddress: addr,
    })
  }

  /**
   * @param {string} amount
   */
  onChangeSendBTCAmount = amount => {
    const numbers = '0123456789'.split('')

    const chars = amount.split('')

    if (!chars.every(c => numbers.includes(c))) {
      return
    }

    this.setState({
      sendToBTCAmount: Number(amount),
    })
  }

  onPressSendBTCScanQR = () => {
    this.setState({
      displayingSendToBTCDialog: false,
      scanningBTCAddressQR: true,
    })
  }

  /** @type {import('react-native-qrcode-scanner').RNQRCodeScannerProps['onRead']} */
  onSuccessfulBTCQRScan = e => {
    this.setState({
      scanningBTCAddressQR: false,
      displayingSendToBTCDialog: true,
      sendToBTCAddress: e.data,
    })
  }

  onPressSendBTC = () => {
    const { sendToBTCAddress } = this.state

    if (sendToBTCAddress.length === 0) {
      return
    }

    this.setState(
      {
        displayingSendToBTCDialog: false,
        displayingSendBTCResultDialog: true,
        sendingBTC: true,
      },
      () => {
        // Check in case dialog was closed before state was updated
        if (!this.state.displayingSendBTCResultDialog) {
          return
        }

        Wallet.sendCoins({
          addr: this.state.sendToBTCAddress,
          amount: this.state.sendToBTCAmount,
        })
          .then(txid => {
            // Check in case dialog was closed before completing fetch.
            if (!this.state.displayingSendBTCResultDialog) {
              return
            }

            this.setState({
              sendingBTC: false,
              sentBTCTXID: txid,
            })
          })
          .catch(e => {
            this.setState({
              sendingBTC: false,
              sentBTCErr: e.message,
            })
          })
      },
    )
  }

  goBackFromSentBTCResultDialog = () => {
    this.setState({
      displayingSendToBTCDialog: true,
      displayingSendBTCResultDialog: false,
    })
  }

  sentBTCResultChoiceToHandler = {
    'View in BlockChain': () => {
      Linking.openURL(`https://blockstream.info/tx/${this.state.sentBTCTXID}`)
    },
    'Copy Transaction ID to Clipboard': () => {
      Clipboard.setString(this.state.sentBTCTXID)

      showCopiedToClipboardToast()
    },
    Ok: () => {
      this.closeAllSendDialogs()
    },
  }

  sentBTCErrChoiceToHandler = {
    Ok: this.goBackFromSentBTCResultDialog,
  }

  //////////////////////////////////////////////////////////////////////////////
  // /SEND BTC /////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  // PAY INVOICE ///////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  payLightningInvoice = () => {
    this.closeAllSendDialogs()

    this.setState({
      displayingPayLightningInvoiceDialog: true,
    })
  }

  /**
   * @param {string} invoice
   */
  onChangeLightningInvoice = invoice => {
    this.setState({
      lightningInvoiceInput: invoice,
    })
  }

  onPressScanLightningInvoiceQR = () => {
    this.setState({
      scanningLightningInvoiceQR: true,
    })
  }

  /** @type {import('react-native-qrcode-scanner').RNQRCodeScannerProps['onRead']} */
  onSuccessfulInvoiceQRScan = e => {
    this.setState({
      scanningLightningInvoiceQR: false,
      lightningInvoiceInput: e.data,
    })
  }

  onPressPayLightningInvoice = () => {
    const { lightningInvoiceInput } = this.state

    if (lightningInvoiceInput.length === 0) {
      return
    }

    this.setState(
      {
        displayingPayLightningInvoiceDialog: false,
        displayingConfirmInvoicePaymentDialog: true,
      },
      () => {
        const { lightningInvoiceInput } = this.state

        Wallet.decodeInvoice({ pay_req: lightningInvoiceInput }).then(
          decodedInvoice => {
            if (!this.state.displayingConfirmInvoicePaymentDialog) {
              return
            }

            this.setState({
              decodedInvoice,
            })
          },
        )
      },
    )
  }

  /**
   * @param {string} amt
   */
  onChangeInvoiceAmt = amt => {
    const numbers = '0123456789'.split('')

    const chars = amt.split('')

    if (!chars.every(c => numbers.includes(c))) {
      return
    }

    this.setState({
      invoiceAmt: Number(amt),
    })
  }

  confirmInvoicePayment = () => {
    this.setState(
      {
        displayingConfirmInvoicePaymentDialog: false,
        displayingInvoicePaymentResult: true,
        payingInvoice: true,
      },
      () => {
        const { decodedInvoice, invoiceAmt, lightningInvoiceInput } = this.state

        if (decodedInvoice === null) {
          console.warn('decodedInvoice === null')
          return
        }

        const zeroInvoice = decodedInvoice.num_satoshis === 0

        Wallet.CAUTION_payInvoice({
          amt: zeroInvoice ? invoiceAmt : undefined,
          payreq: lightningInvoiceInput,
        }).then(() => {
          if (!this.state.displayingInvoicePaymentResult) {
            return
          }

          this.setState({
            payingInvoice: false,
          })
        })
      },
    )
  }

  /**
   * @param {Wallet.DecodeInvoiceResponse} decodedInvoice
   * @returns {JSX.Element}
   */
  renderConfirmInvoiceDialog(decodedInvoice) {
    const { invoiceAmt, payShockInvoiceUserData } = this.state

    const zeroInvoice = decodedInvoice.num_satoshis === 0

    return (
      <View>
        {zeroInvoice && (
          <React.Fragment>
            <Text>
              This invoice doesn't have an amount embedded in it. Enter the
              amount to be paid.
            </Text>
            <ShockInput
              keyboardType="number-pad"
              onChangeText={this.onChangeInvoiceAmt}
              placeholder="Amount in sats."
              value={invoiceAmt.toString()}
            />
          </React.Fragment>
        )}

        <Pad amount={10} />

        {!zeroInvoice && (
          <Text>{`Amount: ${decodedInvoice.num_satoshis}`}</Text>
        )}

        <Pad amount={10} />

        {payShockInvoiceUserData && (
          <React.Fragment>
            <UserDetail
              image={payShockInvoiceUserData.avatar}
              name={
                payShockInvoiceUserData.displayName ||
                payShockInvoiceUserData.pk
              }
              id={payShockInvoiceUserData.pk}
              lowerText="ShockWallet user"
            />

            <Pad amount={10} />
          </React.Fragment>
        )}

        <ShockButton
          disabled={zeroInvoice ? invoiceAmt === 0 : false}
          onPress={this.confirmInvoicePayment}
          title="PAY"
        />
      </View>
    )
  }

  //////////////////////////////////////////////////////////////////////////////
  // /PAY INVOICE //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  sendChoiceToHandler = {
    'Send to BTC Address': this.sendToBTCAddress,
    'Pay Lightning Invoice': this.payLightningInvoice,
  }

  receiveDialogChoiceToHandler = {
    'BTC Address': this.displayBTCAddress,
    'Generate a Lightning Invoice': this.displayCreateInvoiceDialog,
  }

  /** @type {null|ReturnType<typeof setInterval>} */
  balanceIntervalID = null

  /** @type {null|ReturnType<typeof setInterval>} */
  exchangeRateIntervalID = null

  /** @type {null|ReturnType<typeof setInterval>} */
  recentTransactionsIntervalID = null

  /**
   * @param {Props} prevProps
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.navigation.state.params === this.props.navigation.state.params
    ) {
      return
    }

    const newParams = /** @type {Required<Params>} */ (this.props.navigation
      .state.params)

    this.setState(
      {
        displayingConfirmInvoicePaymentDialog: true,
        payShockInvoiceUserData: {
          avatar: newParams.recipientAvatar,
          displayName: null, //newParams.recipientDisplayName,
          pk: newParams.recipientPublicKey,
        },
      },
      () => {
        Wallet.decodeInvoice({ pay_req: newParams.rawInvoice }).then(res => {
          this.setState({
            decodedInvoice: res,
          })
        })
      },
    )
  }

  componentDidMount() {
    this.balanceIntervalID = setInterval(this.fetchBalance, 1500)
    this.exchangeRateIntervalID = setInterval(this.fetchExchangeRate, 1500)
    this.recentTransactionsIntervalID = setInterval(
      this.fetchRecentTransactions,
      1500,
    )
  }

  componentWillUnmount() {
    if (this.balanceIntervalID) {
      clearInterval(this.balanceIntervalID)
    }

    if (this.exchangeRateIntervalID) {
      clearInterval(this.exchangeRateIntervalID)
    }

    if (this.recentTransactionsIntervalID) {
      clearInterval(this.recentTransactionsIntervalID)
    }
  }

  fetchRecentTransactions = async () => {
    await Promise.all([
      Wallet.listInvoices({
        itemsPerPage: 1,
        page: 1,
      }),
      Wallet.listPayments({
        itemsPerPage: 1,
        page: 1,
        paginate: true,
      }),
      Wallet.getTransactions({
        itemsPerPage: 1,
        page: 1,
        paginate: true,
      }),
    ]).then(([invoiceResponse, payments, transactions]) => {
      const unifiedTrx = [
        ...invoiceResponse.content,
        ...payments.content,
        ...transactions.content,
      ]

      this.setState({
        unifiedTrx,
      })
    })
  }

  fetchBalance = () => {
    Wallet.balance()
      .then(balance => {
        this.setState({
          balance: Number(balance.confirmed_balance),
        })
      })
      .catch(e => {
        console.warn(`Error fetching balance: ${e.message}`)
      })
  }

  fetchExchangeRate = () => {
    Wallet.USDExchangeRate()
      .then(USDExchangeRate => {
        this.setState({
          USDExchangeRate,
        })
      })
      .catch(e => {
        console.warn(`Error fetching USD exchange rate: ${e.message}`)
      })
  }

  onPressRequest = () => {
    const { balance } = this.state

    if (balance === null) {
      return
    }

    this.setState({
      displayingReceiveDialog: true,
    })
  }

  renderBalance = () => {
    const { USDExchangeRate, balance } = this.state

    return (
      <View
        style={{
          flex: 2,
          margin: 25,
          backgroundColor: '#56688D',
          borderColor: '#56688D',
          borderWidth: 0.5,
          borderRadius: 10,
        }}
      >
        {balance === null ? (
          <View style={{ flex: 1 }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#56688D',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                BALANCE
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 24,
                }}
              >
                {balance.toFixed(2).toString()} SATS
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: '#56688D',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                USD VALUE
              </Text>

              {USDExchangeRate === null ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 24,
                  }}
                >
                  {'$' +
                    (
                      Math.round(
                        btcConvert(balance, 'Satoshi', 'BTC') *
                          USDExchangeRate *
                          100,
                      ) / 100
                    )
                      .toFixed(2)
                      .toString()}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    )
  }

  render() {
    const {
      createInvoiceAmount,
      createInvoiceMemo,

      displayingSendDialog,

      displayingSendToBTCDialog,
      displayingSendBTCResultDialog,
      sendToBTCAddress,
      scanningBTCAddressQR,
      sendingBTC,
      sendToBTCAmount,
      sentBTCErr,

      displayingPayLightningInvoiceDialog,
      lightningInvoiceInput,
      scanningLightningInvoiceQR,
      displayingConfirmInvoicePaymentDialog,
      decodedInvoice,
      payingInvoice,
      displayingInvoicePaymentResult,

      displayingBTCAddress,
      displayingBTCAddressQR,
      displayingReceiveDialog,
      displayingCreateInvoiceDialog,
      displayingCreateInvoiceResultDialog,
      displayingInvoiceQR,
      displayingOlderFormatBTCAddress,
      displayingOlderFormatBTCAddressQR,
      fetchingBTCAddress,
      fetchingInvoice,
      fetchingOlderFormatBTCAddress,
      invoice,
      receivingBTCAddress,
      receivingOlderFormatBTCAddress,
      unifiedTrx,

      displayingPreShockUserQRScan,
      scanningShockUserQR,
      QRShockUserInfo,
      displayingPostShockUserQRScan,
    } = this.state

    if (scanningBTCAddressQR) {
      return (
        <QRCodeScanner
          bottomContent={
            <TouchableHighlight style={xstyles.buttonTouchable}>
              <Text style={xstyles.buttonText}>OK. Got it!</Text>
            </TouchableHighlight>
          }
          onRead={this.onSuccessfulBTCQRScan}
          showMarker
          topContent={<Text>Point your Camera to the QR Code</Text>}
        />
      )
    }

    if (scanningLightningInvoiceQR) {
      return (
        <QRCodeScanner
          onRead={this.onSuccessfulInvoiceQRScan}
          showMarker
          topContent={<Text>Point your Camera to the QR Code</Text>}
        />
      )
    }

    if (scanningShockUserQR) {
      return (
        <QRCodeScanner
          onRead={this.onSuccessfulShockUserQRScan}
          showMarker
          topContent={<Text>Point your Camera to the QR Code</Text>}
        />
      )
    }

    return (
      <View style={styles.container}>
        <View
          style={{
            height: height / 2,
            width: width,
            backgroundColor: '#2E4674',
          }}
        >
          {this.renderBalance()}

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: width,
              backgroundColor: '#2E4674',
            }}
          >
            <TouchableHighlight
              underlayColor={'transparent'}
              onPress={this.onPressSend}
            >
              <View style={styles.sendButton}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}
                >
                  Send
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={'transparent'}
              onPress={this.onPressRequest}
            >
              <View style={styles.requestButton}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}
                >
                  Request
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            height: height,
            flex: 1,
            width: width,
          }}
        >
          <UnifiedTrx unifiedTrx={unifiedTrx} />
        </View>
        <ShockDialog
          choiceToHandler={this.receiveDialogChoiceToHandler}
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingReceiveDialog}
        />

        <ShockDialog
          choiceToHandler={
            fetchingBTCAddress
              ? this.displayingBTCAddressChoiceToHandlerWhileFetching
              : this.displayingBTCAddressChoiceToHandler
          }
          message={fetchingBTCAddress ? 'Processing...' : receivingBTCAddress}
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingBTCAddress}
        />

        <BasicDialog
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingBTCAddressQR}
        >
          <View style={styles.alignItemsCenter}>
            <QR
              logoToShow="btc"
              value={/** @type {string} */ (receivingBTCAddress)}
            />
            <Pad amount={10} />
            <Text>Scan To Send To This BTC Address</Text>
          </View>
        </BasicDialog>

        <ShockDialog
          choiceToHandler={
            fetchingOlderFormatBTCAddress
              ? this.displayingOlderFormatBTCAddressChoiceToHandlerWhileFetching
              : this.displayingOlderFormatBTCAddressChoiceToHandler
          }
          message={
            fetchingOlderFormatBTCAddress
              ? 'Processing...'
              : receivingOlderFormatBTCAddress
          }
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingOlderFormatBTCAddress}
        />

        <BasicDialog
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingOlderFormatBTCAddressQR}
        >
          <View style={styles.alignItemsCenter}>
            <QR
              logoToShow="btc"
              value={/** @type {string} */ (receivingOlderFormatBTCAddress)}
            />
            <Pad amount={10} />
            <Text>Scan To Send To This BTC Address</Text>
          </View>
        </BasicDialog>

        <BasicDialog
          title="Create a Lightning Invoice"
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingCreateInvoiceDialog}
        >
          <ShockInput
            placeholder="Memo (optional)"
            onChangeText={this.createInvoiceDialogMemoOnChange}
            value={createInvoiceMemo}
          />

          <Pad amount={10} />

          <ShockInput
            keyboardType="number-pad"
            onChangeText={this.createInvoiceDialogAmountOnChange}
            placeholder="Amount (in sats)"
            value={
              createInvoiceAmount === 0
                ? undefined // allow placeholder to show
                : createInvoiceAmount.toString()
            }
          />

          <Pad amount={10} />

          <Text>Invoice will expire in 30min.</Text>

          <Pad amount={10} />

          <ShockButton
            disabled={createInvoiceAmount === 0}
            onPress={this.onPressCreateInvoice}
            title="Create"
          />
        </BasicDialog>

        <BasicDialog
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingInvoiceQR}
        >
          <View style={styles.alignItemsCenter}>
            <QR logoToShow="shock" value={/** @type {string} */ (invoice)} />
            <Pad amount={10} />
            <Text>Scan To Pay This invoice</Text>
          </View>
        </BasicDialog>

        <ShockDialog
          choiceToHandler={
            fetchingInvoice
              ? undefined
              : this.invoiceResultDialogChoiceToHandler
          }
          message={fetchingInvoice ? 'Processing...' : invoice}
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingCreateInvoiceResultDialog}
        />

        {/* SEND */}
        <ShockDialog
          choiceToHandler={this.sendChoiceToHandler}
          onRequestClose={this.closeAllSendDialogs}
          visible={displayingSendDialog}
        />
        {/* /SEND */}

        <BasicDialog
          onRequestClose={this.closeAllSendDialogs}
          visible={displayingSendToBTCDialog}
        >
          <View>
            <ShockInput
              placeholder="BTC Address"
              onChangeText={this.onChangeSendBTCAddress}
              value={sendToBTCAddress}
            />

            <Pad amount={10} />

            <ShockInput
              keyboardType="number-pad"
              onChangeText={this.onChangeSendBTCAmount}
              placeholder="Amount in Sats"
              value={
                sendToBTCAmount === 0 ? undefined : sendToBTCAmount.toString()
              }
            />

            <Pad amount={10} />

            <IGDialogBtn onPress={this.onPressSendBTCScanQR} title="Scan QR" />

            <IGDialogBtn
              disabled={sendToBTCAddress.length === 0 || sendToBTCAmount === 0}
              onPress={this.onPressSendBTC}
              title="Send"
            />
          </View>
        </BasicDialog>

        <ShockDialog
          message={
            sendingBTC
              ? 'Processing...'
              : !!sentBTCErr
              ? `Error: ${sentBTCErr}`
              : 'Payment Sent'
          }
          choiceToHandler={
            sendingBTC
              ? {}
              : sentBTCErr === null
              ? this.sentBTCResultChoiceToHandler
              : this.sentBTCErrChoiceToHandler
          }
          onRequestClose={
            sentBTCErr === null
              ? this.closeAllSendDialogs
              : this.goBackFromSentBTCResultDialog
          }
          visible={displayingSendBTCResultDialog}
        />

        <BasicDialog
          onRequestClose={this.closeAllSendDialogs}
          visible={displayingPayLightningInvoiceDialog}
        >
          <View>
            <ShockInput
              placeholder="Paste or type lightning invoice here"
              onChangeText={this.onChangeLightningInvoice}
              value={lightningInvoiceInput}
            />

            <IGDialogBtn
              onPress={this.onPressScanLightningInvoiceQR}
              title="Scan QR"
            />

            <IGDialogBtn
              onPress={this.onPressPayLightningInvoice}
              title="Pay"
            />
          </View>
        </BasicDialog>

        <BasicDialog
          onRequestClose={this.closeAllSendDialogs}
          title="Pay Invoice"
          visible={displayingConfirmInvoicePaymentDialog}
        >
          <View>
            {decodedInvoice === null ? (
              <ActivityIndicator />
            ) : (
              this.renderConfirmInvoiceDialog(decodedInvoice)
            )}
          </View>
        </BasicDialog>

        <BasicDialog
          onRequestClose={this.closeAllSendDialogs}
          title={payingInvoice ? 'Processing...' : 'Success!'}
          visible={displayingInvoicePaymentResult}
        >
          {payingInvoice ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.alignItemsCenter}>
              <EntypoIcons size={22} color="#2E4674" name="check" />
            </View>
          )}
        </BasicDialog>

        <ShockDialog
          choiceToHandler={this.preQRScanDialogChoiceToHandler}
          message="Tell the other user to open up their profile, generate a handshake address then scan their QR"
          onRequestClose={this.closeAllReceiveDialogs}
          visible={displayingPreShockUserQRScan}
        />

        <BasicDialog
          visible={displayingPostShockUserQRScan}
          onRequestClose={this.closeAllReceiveDialogs}
          title="Confirm"
        >
          <View style={[styles.alignItemsCenter, { width: '100%' }]}>
            <Text>Sending an Invoice To: </Text>

            <Pad amount={10} />

            {QRShockUserInfo && <Text>{QRShockUserInfo.name}</Text>}

            <Pad amount={10} />

            {createInvoiceAmount === 0 ? null : (
              <Text>{`For an amount of: ${createInvoiceAmount} sats`}</Text>
            )}

            <ShockButton title="SEND" onPress={this.confirmSendToShockUser} />
          </View>
        </BasicDialog>
      </View>
    )
  }
}

const xstyles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    backgroundColor: 'black',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    // paddingBottom: height / 10
  },
  shockWalletLogoContainer: {
    flex: 1,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enabledSubmitBtn: {
    height: 25,
    width: width / 2,
    borderWidth: 0.5,
    backgroundColor: '#eba844',
    borderColor: '#eba844',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sendButton: {
    height: 50,
    width: width / 2.5,
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
    borderWidth: 0.5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 20,
  },
  requestButton: {
    height: 50,
    width: width / 2.5,
    borderWidth: 0.5,
    backgroundColor: '#3B7BD4',
    borderColor: '#3B7BD4',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginRight: 20,
  },
})
