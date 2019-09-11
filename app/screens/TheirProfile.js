/**
 * @format
 */
import Icon from 'react-native-vector-icons/Foundation'
import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}, { title: string }>} Navigation
 */

import * as API from '../services/contact-api'
import ShockAvatar from '../components/ShockAvatar'

/**
 * @typedef {object} Params
 * @prop {string} publicKey
 * @prop {string} title
 */

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {object} State
 * @prop {API.Schema.SimpleSentRequest[]|null} sentRequests
 * @prop {API.Schema.User[]|null} users
 */

/**
 * @augments React.PureComponent<Props, State>
 */
export default class User extends React.PureComponent {
  /**
   * @param {{ navigation: Navigation }} args
   * @returns {import('react-navigation').NavigationStackScreenOptions}
   */
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title')

    return {
      // headerTransparent: true,
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
      },

      title,
    }
  }

  /** @type {State} */
  state = {
    sentRequests: null,
    users: null,
  }

  sentRequestsUnsub = () => {}
  usersUnsub = () => {}

  componentDidUpdate() {
    const { navigation } = this.props
    const { users } = this.state
    if (users === null) return
    if (users.length === 0) return
    const pk = navigation.getParam('publicKey')
    const user = /** @type {API.Schema.User} */ (users.find(
      u => u.publicKey === pk,
    ))
    const oldTitle = navigation.getParam('title')
    if (typeof oldTitle === 'undefined') {
      navigation.setParams({ title: user.publicKey })
    }
    if (oldTitle === user.publicKey && user.displayName) {
      navigation.setParams({ title: user.displayName })
    }
  }

  componentDidMount() {
    this.usersUnsub = API.Events.onUsers(this.onUsers)
    this.sentRequestsUnsub = API.Events.onSentRequests(this.onSentRequests)
  }

  componentWillUnmount() {
    this.usersUnsub()
  }

  /**
   * @private
   * @param {API.Schema.SimpleSentRequest[]} sentRequests
   * @returns {void}
   */
  onSentRequests = sentRequests => {
    this.setState({
      sentRequests,
    })
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
   * @returns {void}
   */
  onPressMessage = () => {
    const users = /** @type {API.Schema.User[]} */ (this.state.users)
    const pk = this.props.navigation.getParam('publicKey')
    const user = /** @type {API.Schema.User} */ (users.find(
      u => u.publicKey === pk,
    ))

    // CAST: If the current handshake address were null the message button would
    // be disabled
    API.Actions.sendHandshakeRequest(
      /** @type {string} */ (user.currentHandshakeAddress),
      pk,
    )
  }

  render() {
    const { sentRequests, users } = this.state

    if (users === null) {
      return <ActivityIndicator />
    }

    if (users.length === 0) {
      return <ActivityIndicator />
    }

    if (sentRequests === null) {
      return <ActivityIndicator />
    }

    const pk = this.props.navigation.getParam('publicKey')

    const maybeRequest = sentRequests.find(r => r.recipientPublicKey === pk)

    let pendingRequest = false

    pendingRequest = maybeRequest
      ? !maybeRequest.recipientChangedRequestAddress
      : false

    const user = /** @type {API.Schema.User} */ (users.find(
      u => u.publicKey === pk,
    ))

    const userHasNoHandshakeAddress = user.currentHandshakeAddress === null

    return (
      <View style={styles.container}>
        <ShockAvatar
          displayName={user.displayName}
          height={180}
          image={user.avatar}
        />

        {userHasNoHandshakeAddress && (
          <Text>User Has No Handshake Address</Text>
        )}

        <View style={styles.actions}>
          <Icon.Button
            color={
              pendingRequest || userHasNoHandshakeAddress ? 'grey' : undefined
            }
            disabled={pendingRequest || userHasNoHandshakeAddress}
            name="mail"
            onPress={this.onPressMessage}
          >
            Message
          </Icon.Button>
          <Icon.Button name="mail">Send</Icon.Button>
          <Icon.Button name="clipboard-notes">Request</Icon.Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
})
