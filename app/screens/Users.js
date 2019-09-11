/**
 * @format
 */
import React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native'

import * as API from '../services/contact-api'
import UserDetail from '../components/UserDetail'

/**
 * @param {API.Schema.User} user
 * @returns {string}
 */
const userKeyExtract = user => user.publicKey

const NoUsers = React.memo(() => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>It's lonely around here... No other users exist at this point</Text>
  </View>
))

/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {object} State
 * @prop {API.Schema.User[]|null} users
 */

/**
 * @augments React.PureComponent<Props, State>
 */
export default class Users extends React.PureComponent {
  /**
   * @type {import('react-navigation').NavigationScreenOption<{}>}
   */
  static navigationOptions = {
    headerTitle: 'Users',
  }

  /**
   * @type {State}
   */
  state = {
    users: [],
  }

  usersUnsubscribe = () => {}

  componentDidMount() {
    this.usersUnsubscribe = API.Events.onUsers(this.onUsers)
  }

  componentWillUnmount() {
    this.usersUnsubscribe()
  }

  /**
   * @private
   * @param {API.Schema.User[]} users
   * @returns {void}
   */
  onUsers = users => {
    this.setState({
      users,
    })
  }

  /**
   * @private
   * @param {string} publicKey
   * @returns {void}
   */
  onPressUser = publicKey => {
    this.props.navigation.navigate('User', {
      publicKey,
    })
  }

  /**
   * @private
   * @param {{ item: API.Schema.User }} args
   * @returns {React.ReactElement<any> | null}
   */
  renderUser = ({ item: user }) => {
    return (
      <View style={styles.user}>
        <UserDetail
          id={user.publicKey}
          name={user.displayName ? user.displayName : user.publicKey}
          image={user.avatar}
          onPress={this.onPressUser}
        />
      </View>
    )
  }

  render() {
    const { users } = this.state

    if (users === null) {
      return <ActivityIndicator />
    }

    if (users.length === 0) {
      return <NoUsers />
    }

    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={users}
        keyExtractor={userKeyExtract}
        renderItem={this.renderUser}
        ListEmptyComponent={NoUsers}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },

  user: {
    paddingBottom: 10,
    paddingTop: 10,
  },
})
