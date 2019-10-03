/**
 * @format
 */

import React from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import EntypoIcons from 'react-native-vector-icons/Entypo'

import btcConvert from '../../services/convertBitcoin'
import * as Wallet from '../../services/wallet'

import UnifiedTrx from './UnifiedTrx'

/**
 * @typedef {object} Props
 */

/**
 * @typedef {object} State
 * @prop {number|null} USDExchangeRate Null on first fetch.
 * @prop {number|null} balance Null on first fetch.
 * @prop {(Wallet.Invoice|Wallet.Payment|Wallet.Transaction)[]|null} unifiedTrx
 */

const { width, height } = Dimensions.get('window')

export const WALLET_OVERVIEW = 'WALLET_OVERVIEW'

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
    balance: null,
    USDExchangeRate: null,
    unifiedTrx: null,
  }

  /** @type {null|ReturnType<typeof setInterval>} */
  balanceIntervalID = null

  /** @type {null|ReturnType<typeof setInterval>} */
  exchangeRateIntervalID = null

  /** @type {null|ReturnType<typeof setInterval>} */
  recentTransactionsIntervalID = null

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
        ...invoiceResponse.entries,
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
  }

  onPressSend = () => {
    const { balance } = this.state

    if (balance === null) {
      return
    }
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
                {balance.toFixed(2).toString()} BITS
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
    const { unifiedTrx } = this.state

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
