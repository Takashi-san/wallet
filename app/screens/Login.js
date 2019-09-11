/**
 * @prettier
 */
import React from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

import * as API from '../services/contact-api'
import ShockButton from '../components/ShockButton'
import { REGISTER } from './Register'

export const LOGIN = 'LOGIN'

const SHOCK_LOGO_STYLE = { width: 100, height: 100 }

/** @type {number} */
// @ts-ignore
const shockLogo = require('../assets/images/shocklogo.png')

/**
 * @typedef {object} Props
 * @prop {Navigation} navigation
 */

/**
 * @typedef {object} State
 * @prop {string} alias
 * @prop {boolean} awaitingRes
 * @prop {boolean} connected
 * @prop {string} pass
 */

/**
 * @augments React.PureComponent<Props, State>
 */
export default class FakeLogin extends React.PureComponent {
  /**
   * @type {import('react-navigation').NavigationScreenOptions}
   */
  static navigationOptions = {
    header: null,
  }

  /** @type {State} */
  state = {
    alias: '',
    awaitingRes: true,
    connected: false,
    pass: '',
  }

  connUnsubscribe = () => {}
  willFocusSub = {
    remove() {},
  }

  componentDidMount() {
    this.connUnsubscribe = API.Events.onConnection(this.onConn)
    this.willFocusSub = this.props.navigation.addListener('didFocus', () => {
      this.setState({
        awaitingRes: false,
      })
    })
  }

  componentWillUnmount() {
    this.connUnsubscribe()
    this.willFocusSub.remove()
  }

  /**
   * @private
   * @param {boolean} connected
   * @returns {void}
   */
  onConn = connected => {
    this.setState({
      connected,
    })
  }

  /**
   * @private
   * @param {string} alias
   * @returns {void}
   */
  onChangeAlias = alias => {
    this.setState({ alias })
  }

  /**
   * @private
   * @param {string} pass
   * @returns {void}
   */
  onChangePass = pass => {
    this.setState({ pass })
  }

  /**
   * @private
   * @returns {void}
   */
  login = () => {
    if (this.state.awaitingRes || this.state.alias.length === 0) {
      return
    }

    this.setState({
      awaitingRes: true,
    })

    API.Actions.auth(this.state.alias, this.state.pass)
  }

  /**
   * @private
   * @returns {void}
   */
  goToRegister = () => {
    this.props.navigation.navigate(REGISTER)
  }

  render() {
    const { alias, awaitingRes, connected, pass } = this.state

    const enableLoginBtn = connected && alias.length > 0 && pass.length > 0

    return (
      <View style={styles.container}>
        <View style={styles.shockWalletLogoContainer}>
          <Image style={SHOCK_LOGO_STYLE} source={shockLogo} />
          <Text style={styles.logoText}>S H O C K W A L L E T</Text>
        </View>

        {awaitingRes && <ActivityIndicator animating size="large" />}

        {!awaitingRes && (
          <View style={styles.shockWalletCallToActionContainer}>
            <Text style={styles.callToAction}>Login</Text>
          </View>
        )}

        {!awaitingRes && (
          <View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={connected}
              onChangeText={this.onChangeAlias}
              placeholder="alias"
              placeholderTextColor="grey"
              style={styles.textInputField}
              value={alias}
            />

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={connected}
              onChangeText={this.onChangePass}
              placeholder="pass"
              placeholderTextColor="grey"
              style={styles.textInputField}
              value={pass}
            />

            <ShockButton
              disabled={!enableLoginBtn}
              onPress={this.login}
              title="Login"
            />

            <ShockButton
              color="grey"
              onPress={this.goToRegister}
              title="Register"
            />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E4674',
    justifyContent: 'space-around',
    paddingLeft: 30,
    paddingRight: 30,
  },
  shockWalletLogoContainer: {
    alignItems: 'center',
  },
  shockWalletCallToActionContainer: {
    alignItems: 'center',
  },
  textInputField: {
    backgroundColor: '#ffffff',
    height: 50,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  logoText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
  },
  callToAction: { color: '#ffffff', fontWeight: 'bold', fontSize: 28 },
})
