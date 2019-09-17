/**
 * @format
 */
import React from 'react'

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import * as Wallet from '../../services/wallet'

import UnifiedTransaction from './UnifiedTransaction'
/**
 * @typedef {import('./UnifiedTransaction').IUnifiedTransaction} IUnifiedTransaction
 */

/** @type {React.FC} */
const Separator = () => <View style={styles.separator} />

/** @type {React.FC} */
const Empty = () => ((
  <View>
    <Text>No recent transactions</Text>
  </View>
))

/**
 * @typedef {object} Props
 * @prop {((rHashOrPaymentHashOrTxHash: string) => void)=} onPressItem
 * (Optional)
 * @prop {IUnifiedTransaction[]|null} unifiedTrx Null when loading. When loading
 * a loading indicator will be shown.
 */

/**
 * @param {IUnifiedTransaction} unifiedTransaction
 * @returns {string}
 */
const keyExtractor = unifiedTransaction => {
  if (Wallet.isInvoice(unifiedTransaction)) {
    return unifiedTransaction.r_hash
  }

  if (Wallet.isPayment(unifiedTransaction)) {
    return unifiedTransaction.payment_hash
  }

  if (Wallet.isTransaction(unifiedTransaction)) {
    return unifiedTransaction.tx_hash
  }

  throw new TypeError()
}

/**
 * @augments React.PureComponent<Props, {}, never>
 */
export default class UnifiedTransactions extends React.PureComponent {
  /**
   * @type {import('react-native').ListRenderItem<IUnifiedTransaction>}
   */
  renderItem = ({ item }) => ((
    <UnifiedTransaction
      unifiedTransaction={item}
      onPress={this.props.onPressItem}
    />
  ))

  render() {
    const { unifiedTrx } = this.props

    if (unifiedTrx === null) {
      return <ActivityIndicator />
    }

    return (
      <FlatList
        data={unifiedTrx}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={Empty}
        renderItem={this.renderItem}
      />
    )
  }
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#CED0CE',
    height: 1,
    width: '100%',
  },
})
