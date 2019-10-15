/**
 * @format
 */
import React from 'react'

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Avatar } from 'react-native-elements'
import moment from 'moment'

import btcConvert from '../../services/convertBitcoin'

import * as Wallet from '../../services/wallet'

/**
 * @typedef {Wallet.Invoice|Wallet.Payment|Wallet.Transaction} IUnifiedTransaction
 */

/**
 * @typedef {object} Props
 * @prop {IUnifiedTransaction} unifiedTransaction
 * @prop {((rHashOrPaymentRequestOrTxHash: string) => void)=} onPress
 */

const width = Dimensions.get('window').width

const PLACEHOLDER_AVATAR_SOURCE = {
  uri: 'https://ask.libreoffice.org/m/default/media/images/nophoto.png',
}

/**
 * "Component" suffix in name to avoid collision with Transaction interface.
 * @augments React.PureComponent<Props, {}, never>
 */
export default class UnifiedTransaction extends React.PureComponent {
  onPress() {
    const { onPress, unifiedTransaction } = this.props

    if (!onPress) {
      return
    }

    if (Wallet.isInvoice(unifiedTransaction)) {
      onPress(unifiedTransaction.payment_request)
    }

    if (Wallet.isPayment(unifiedTransaction)) {
      onPress(unifiedTransaction.payment_hash)
    }

    if (Wallet.isTransaction(unifiedTransaction)) {
      onPress(unifiedTransaction.tx_hash)
    }
  }

  render() {
    const { unifiedTransaction } = this.props

    let id = ''
    let value = 0
    let timestamp = 0

    if (Wallet.isInvoice(unifiedTransaction)) {
      id = unifiedTransaction.payment_request
      value = Number(unifiedTransaction.value)
      timestamp = Number(unifiedTransaction.settle_date)
    }

    if (Wallet.isPayment(unifiedTransaction)) {
      id = unifiedTransaction.payment_hash
      value = unifiedTransaction.value
      timestamp = unifiedTransaction.creation_date
    }

    if (Wallet.isTransaction(unifiedTransaction)) {
      id = unifiedTransaction.tx_hash
      value = unifiedTransaction.amount
      timestamp = unifiedTransaction.time_stamp
    }

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.transaction}>
          <View style={styles.avatarContainer}>
            <Avatar
              activeOpacity={0.7}
              rounded
              small
              source={PLACEHOLDER_AVATAR_SOURCE}
            />
          </View>

          <View style={styles.transactionBody}>
            <Text style={styles.boldFont}>{id}</Text>
            <Text>{`${value} SATS`}</Text>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{moment(timestamp).fromNow()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  boldFont: {
    fontWeight: 'bold',
  },

  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateText: {
    fontSize: 14,
    marginLeft: width / 10,
    marginRight: width / 10,
  },

  transaction: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    width: width,
  },

  transactionBody: {
    flex: 0,
    flexGrow: 1,
    justifyContent: 'center',
  },
})
