/**
 * @prettier
 */
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import moment from 'moment'
import { Divider, Icon } from 'react-native-elements'

import UserDetail from '../components/UserDetail'
import { Colors, SCREEN_PADDING } from '../css'

const FAKE_CHATS: Array<Chat> = [
  {
    get id() {
      return this.lastMessage + this.name
    },
    lastMessage:
      'Hey Pete, just wondering what you’d want for those cool pairs of shoes!',
    name: 'Mel Winters',
    timestamp: moment()
      .subtract(1, 'minutes')
      .toDate()
      .getTime(),
    unread: true,
  },
  {
    get id() {
      return this.lastMessage + this.name
    },
    lastMessage: 'Hey, how much would you want?',
    name: 'Michael Farrington',
    timestamp: moment()
      .subtract(1, 'minutes')
      .toDate()
      .getTime(),
    unread: false,
  },
  {
    get id() {
      return this.lastMessage + this.name
    },
    lastMessage:
      'Hi, anything interested? I would sell it for quite a cheap price.',
    name: 'Tom Wallace',
    timestamp: moment()
      .subtract(3, 'hours')
      .toDate()
      .getTime(),
    unread: false,
  },
]

const NoMessages = React.memo(() => (
  <Text>'insert something here about there being no chats'</Text>
))

const keyExtractor = (item: Chat): React.Key => item.id

interface Chat {
  id: string;
  lastMessage: string;
  name: string;
  timestamp: number;
  unread: string;
}

interface State {
  chats: Array<Chat>;
}

export default class Messages extends React.PureComponent<{}, State> {
  state = {
    chats: [],
  }

  componentDidMount() {
    this.setState({
      chats: FAKE_CHATS,
    })
  }

  onPressMessage = (id: string) => {
    console.warn(id)
  }

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
