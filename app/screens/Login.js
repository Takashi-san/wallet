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
import * as Auth from '../services/auth'
import ShockButton from '../components/ShockButton'
import ShockDialog from '../components/ShockDialog'
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
 * @prop {string} err
 * @prop {string} pass
 */

/**
 * @augments React.PureComponent<Props, State>
 */
export default class Login extends React.PureComponent {
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
    err: '',
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
   */
  dismissDialog = () => {
    this.setState({
      err: '',
    })
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
  onPressUnlock = () => {
    if (this.state.awaitingRes || this.state.alias.length === 0) {
      return
    }

    this.setState(
      {
        awaitingRes: true,
      },
      () => {
        Auth.unlockWallet(this.state.alias, this.state.pass)
          .then(res => {
            API.Events.initAuthData(res)
            // Cache.writeStoredAuthData({
            //   publicKey: res.publicKey,
            //   token: res.token,
            // })
          })
          .catch(e => {
            this.setState({
              err: e.message,
            })
          })
          .finally(() => {
            this.setState({
              awaitingRes: false,
            })
          })
      },
    )
  }

  /**
   * @private
   * @returns {void}
   */
  goToCreateWallet = () => {
    this.props.navigation.navigate(REGISTER)
  }

  render() {
    const { alias, awaitingRes, connected, pass } = this.state

    const enableUnlockBtn = connected && alias.length > 0 && pass.length > 0

    return (
      <View style={styles.container}>
        <View style={styles.shockWalletLogoContainer}>
          <Image style={SHOCK_LOGO_STYLE} source={shockLogo} />
          <Text style={styles.logoText}>S H O C K W A L L E T</Text>
        </View>

        {awaitingRes && <ActivityIndicator animating size="large" />}

        {!awaitingRes && (
          <View style={styles.shockWalletCallToActionContainer}>
            <Text style={styles.callToAction}>Unlock Wallet</Text>
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
              disabled={!enableUnlockBtn}
              onPress={this.onPressUnlock}
              title="Unlock"
            />

            <ShockButton
              color="grey"
              onPress={this.goToCreateWallet}
              title="Create Wallet"
            />
          </View>
        )}

        <ShockDialog
          message={this.state.err}
          onRequestClose={this.dismissDialog}
          visible={!!this.state.err}
        />
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
