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

const FAKE_TRANSACTIONS: Array<Transaction> = [
  {
    amount: 0.01200661,
    get symbol() {
      return this.outgoing ? '-' : '+'
    },
    id: '1',
    outgoing: false,
    userName: 'Matt Thompson',
    timestamp: moment()
      .subtract(1, 'minues')
      .toDate()
      .getTime(),
  },
  {
    amount: 0.01200661,
    get symbol() {
      return this.outgoing ? '-' : '+'
    },
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
    get symbol() {
      return this.outgoing ? '-' : '+'
    },
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
    get symbol() {
      return this.outgoing ? '-' : '+'
    },
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
    get symbol() {
      return this.outgoing ? '-' : '+'
    },
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
    get symbol() {
      return this.outgoing ? '-' : '+'
    },
    id: '6',
    outgoing: true,
    userName: 'Jane Welling',
    timestamp: moment()
      .subtract(5, 'days')
      .toDate()
      .getTime(),
  },
]

const KeyExtractor = (item: Transaction): React.Key => item.id

const NoTransactions = React.memo(() => (
  <Text>'There's no transactions availables</Text>
))

interface Transaction {
  amount: number;
  id?: number | string;
  userName: string;
  timestamp: string;
  image?: string;
  outgoing: boolean;
}

interface State {
  transactions: Array<Transaction>;
}

const sample =
  'https://react-native-training.github.io/react-native-elements/img/avatar/avatar--photo.jpg'

export default class TransactionHistory extends React.PureComponent<{}, State> {
  state = {
    transactions: [],
  }

  onPressTransaction = (id: string) => {
    console.log(id)
  }

  itemRenderer = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.userDetailContainer}>
        <UserDetail
          id={item.id}
          name={item.userName}
          nameBold
          lowerText={`${item.symbol} ${item.amount}`}
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
    const { transactions } = this.state
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
