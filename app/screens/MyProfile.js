/** @format */
import React from 'react'

import { TextInput, Button, View } from 'react-native'

import * as API from '../services/contact-api'
import { CHATS_ROUTE } from './Chats'

export default class MyProfile extends React.PureComponent {
  state = {
    displayName: '',
  }

  /**
   * @param {string} displayName
   * @returns {void}
   */
  onChange = displayName => {
    this.setState({
      displayName,
    })
  }

  onPress = () => {
    API.Actions.setDisplayName(this.state.displayName)
  }

  goToChats = () => {
    this.props.navigation.navigate(CHATS_ROUTE)
  }

  genHandAddr = () => {
    API.Actions.generateNewHandshakeNode()
  }

  logout = () => {
    API.Actions.logout()
  }

  render() {
    return (
      <View>
        <TextInput
          onChangeText={this.onChange}
          value={this.state.displayName}
        />
        <Button title="Logout" onPress={this.logout} />
        <Button title="Change" onPress={this.onPress} />
        <Button title="Continue to Chats" onPress={this.goToChats} />
        <Button title="Generate Handshake Address" onPress={this.genHandAddr} />
      </View>
    )
  }
}
