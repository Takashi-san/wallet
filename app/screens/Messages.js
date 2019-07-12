/**
 * @prettier
 */
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import moment from 'moment'
import { Divider, Icon } from 'react-native-elements'

import UserDetail from '../components/UserDetail'
import { Colors, SCREEN_PADDING } from '../css'

const NoMessages = React.memo(() => (
  <Text>'insert something here about there being no chats'</Text>
))

/**
 * @param {Chat} item
 * @returns {string}
 */
const keyExtractor = item => item.id

/**
 * @typedef {object} Chat
 * @prop {string} id
 * @prop {string} lastMessage
 * @prop {string} name
 * @prop {number} timestamp
 * @prop {boolean} unread
 */

/**
 * @typedef {object} State
 * @prop {Chat[]} chats
 */

/**
 * @augments React.PureComponent<{}, State>
 */
export default class Messages extends React.PureComponent {
  state = {
    chats: [],
  }

  /**
   * @param {string} id
   */
  onPressMessage = id => {
    console.warn(id)
  }

  /**
   * @param {{ item: Chat }} args
   */
  itemRenderer = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.userDetailContainer}>
        <UserDetail
          id={item.id}
          alternateText={`(${moment(item.timestamp).fromNow()})`}
          lowerText={item.lastMessage}
          alternateTextBold={item.unread}
          name={item.name}
          nameBold={item.unread}
          lowerTextStyle={item.unread ? styles.boldFont : undefined}
          onPress={this.onPressMessage}
        />
      </View>
      <Icon
        size={28}
        name="chevron-right"
        type="font-awesome"
        color={Colors.ORANGE}
      />
    </View>
  )

  render() {
    const { chats } = this.state

    return (
      <FlatList
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Divider}
        data={chats}
        keyExtractor={keyExtractor}
        renderItem={this.itemRenderer}
        style={styles.list}
        ListEmptyComponent={NoMessages}
      />
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

  list: {
    flex: 1,
  },

  userDetailContainer: {
    flex: 1,
    marginRight: 20,
  },
}
