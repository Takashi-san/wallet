/**
 * @prettier
 */
import React from 'react'
import { ActivityIndicator, Button, TextInput, View } from 'react-native'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

import * as API from '../services/contact-api'
import { CHATS_ROUTE } from './Chats'

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {object} State
 * @prop {string} alias
 * @prop {boolean} authenticating
 * @prop {string} recipientAlias
 * @prop {string} recipientHandshakeAddress
 */

/**
 * @augments React.PureComponent<Props, State>
 */
export default class FakeLogin extends React.PureComponent {
  /** @type {State} */
  state = {
    alias: '',
    authenticating: false,
    recipientAlias: '',
    recipientHandshakeAddress: '',
  }

  /**
   * @private
   * @param {string} alias
   */
  onChangeAlias = alias => {
    this.setState({ alias })
  }

  /** @private */
  login = () => {
    this.setState({
      authenticating: true,
    })

    API.Actions.authenticate(this.state.alias, 'PASSWORD')
      .then(() => {
        console.warn('logged in')
      })
      .catch(e => {
        console.warn(e.message || e)
      })
      .finally(() => {
        this.setState({
          authenticating: false,
        })
      })
  }

  /** @private */
  logout = () => {
    this.setState({
      authenticating: true,
    })
    API.Actions.logout()
      .then(() => {
        console.warn('logged out')
      })
      .catch(e => {
        console.warn(e.message || e)
      })
      .finally(() => {
        this.setState({
          authenticating: false,
        })
      })
  }

  checkUser = () => {
    API.Gun.gun
      .user(this.state.recipientAlias)
      .get('currentHandshakeNode')
      .once(hn => {
        if (typeof hn === 'object' && hn !== null) {
          this.setState({
            recipientHandshakeAddress: hn._['#'],
          })
        } else {
          console.warn('either user does not exist or has no handshake address')
        }
      })
  }

  sendRequest = () => {
    if (!this.state.recipientHandshakeAddress) {
      console.warn('no handshake address')
    } else if (!this.state.recipientAlias) {
      console.warn('no recipient alias')
    } else {
      API.Actions.sendHandshakeRequest(
        this.state.recipientHandshakeAddress,
        this.state.recipientAlias,
      )
        .then(() => {
          console.warn('sent successfully')
        })
        .catch(e => {
          console.warn(e.message || e)
        })
    }
  }

  /**
   * @param {string} recipientAlias
   */
  onChangeRecipientAlias = recipientAlias => {
    this.setState({
      recipientAlias,
    })
  }

  generateHandshakeAddress = () => {
    API.Actions.generateNewHandshakeNode()
      .then(() => {
        console.warn('ok')
      })
      .catch(e => {
        console.warn(e.message || e)
      })
  }

  goToChats = () => {
    this.props.navigation.navigate(CHATS_ROUTE)
  }

  render() {
    return (
      <View>
        <TextInput
          editable={!this.state.authenticating}
          onChangeText={this.onChangeAlias}
          placeholder="alias"
          value={this.state.alias}
        />
        <Button
          disabled={this.state.authenticating}
          onPress={this.login}
          title="login"
        />
        <Button
          disabled={this.state.authenticating}
          onPress={this.logout}
          title="logout"
        />

        <Button
          disabled={this.state.authenticating}
          onPress={this.generateHandshakeAddress}
          title="Generate handshake address"
        />

        <Button
          disabled={this.state.authenticating}
          onPress={this.goToChats}
          title="go to chats"
        />

        {this.state.authenticating && <ActivityIndicator />}

        <View style={{ height: 50 }} />

        <TextInput
          editable={!this.state.authenticating}
          onChangeText={this.onChangeRecipientAlias}
          placeholder="recipient alias"
          value={this.state.recipientAlias}
        />

        <Button
          disabled={this.state.authenticating}
          onPress={this.checkUser}
          title="Check user for handshake address"
        />

        {this.state.recipientHandshakeAddress.length > 0 && (
          <Button
            disabled={this.state.authenticating}
            onPress={this.sendRequest}
            title="send"
          />
        )}
      </View>
    )
  }
}
