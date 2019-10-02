/**
 * @prettier
 */
import React from 'react'
import { Text, View, StyleSheet, ScrollView, FlatList } from 'react-native'
import { Avatar, Divider } from 'react-native-elements'

import * as CSS from '../css'
import UserDetail from '../components/UserDetail'

import moment from 'moment'

// Todo: Transform bits values to a BTC string value

/**
 * @type {Transaction[]}
 */
const FAKE_TRANSACTIONS = [
  {
    amount: 0.01200661,
    id: '1',
    outgoing: false,
    userName: 'Matt Thompson',
    timestamp: moment()
      .subtract(1, 'minutes')
      .toDate()
      .getTime(),
  },
  {
    amount: 0.01200661,
    id: '2',
    userName: 'Jane Welling',
    timestamp: moment()
      .subtract(5, 'days')
      .toDate()
      .getTime(),
    outgoing: false,
  },
  {
    amount: 0.01200661,
    id: '3',
    outgoing: false,
    userName: 'Michael Farrignton',
    timestamp: moment()
      .subtract(5, 'days')
      .toDate()
      .getTime(),
  },
  {
    amount: 0.01200661,
    id: '4',
    outgoing: true,
    userName: 'Bryan Xiang',
    timestamp: moment()
      .subtract(5, 'days')
      .toDate()
      .getTime(),
  },
  {
    amount: 0.01200661,
    id: '5',
    outgoing: false,
    userName: 'Mel Winters',
    timestamp: moment()
      .subtract(5, 'days')
      .toDate()
      .getTime(),
  },
  {
    amount: 0.01200661,
    id: '6',
    outgoing: true,
    userName: 'Jane Welling',
    timestamp: moment()
      .subtract(5, 'days')
      .toDate()
      .getTime(),
  },
]

/**
 *
 * @param {Transaction} item
 * @returns {string}
 */
const KeyExtractor = item => String(item.id)

const NoTransactions = React.memo(() => (
  <Text>'There's no transactions availables</Text>
))

/**
 * @typedef {object} Transaction
 * @prop {number} amount
 * @prop {number|string} id
 * @prop {string} userName
 * @prop {number} timestamp
 * @prop {string=} image
 * @prop {boolean} outgoing
 */

/**
 * @typedef {object} State
 * @prop {Transaction[]} transactions
 */

const sample =
  'https://react-native-training.github.io/react-native-elements/img/avatar/avatar--photo.jpg'

/**
 * @augments React.PureComponent<{}, State, never>
 */
export default class TransactionHistory extends React.PureComponent {
  state = {
    transactions: [],
  }

  /**
   * @param {string} id
   */
  onPressTransaction = id => {
    console.log(id)
  }

  /**
   * @param {{ item: Transaction }} args
   */
  itemRenderer = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.userDetailContainer}>
        <UserDetail
          id={String(item.id)}
          name={item.userName}
          nameBold
          lowerText={`${item.outgoing ? '-' : '+'} ${item.amount}`}
          lowerTextStyle={
            item.outgoing ? styles.satsLossedText : styles.satsGainedText
          }
          onPress={this.onPressTransaction}
        />
      </View>
      <Text style={styles.timestampText}>
        {moment(item.timestamp).fromNow()} ago
      </Text>
    </View>
  )

  render() {
    return (
      <View style={styles.list}>
        <FlatList
          contentContainerStyle={styles.list}
          data={FAKE_TRANSACTIONS}
          keyExtractor={KeyExtractor}
          renderItem={this.itemRenderer}
          ItemSeparatorComponent={Divider}
          ListEmptyComponent={NoTransactions}
          style={styles.list}
        />
      </View>
    )
  }
}

const ITEM_CONTAINER_HORIZONTAL_PADDING = CSS.SCREEN_PADDING / 2
const ITEM_CONTAINER_VERTICAL_PADDING = 15

const SATS_TRANSACTION_GAINED_COLOR = '#1ABB25'
const SATS_TRANSACTION_LOSS_COLOR = '#E00F29'

const styles = StyleSheet.create({
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

  satsGainedText: {
    color: SATS_TRANSACTION_GAINED_COLOR,
    fontSize: 14,
  },

  satsLossedText: {
    color: SATS_TRANSACTION_LOSS_COLOR,
    fontSize: 14,
  },

  timestampText: {
    fontSize: 14,
    color: CSS.Colors.TEXT_LIGHTEST,
  },
})
