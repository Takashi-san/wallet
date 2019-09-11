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
import once from 'lodash/once'
import debounce from 'lodash/debounce'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

import * as API from '../services/contact-api'
import ShockButton from '../components/ShockButton'
import { APP } from '../factories/RootStack'

export const CHOOSE_DISPLAY_NAME = 'CHOOSE_DISPLAY_NAME'

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
 * @prop {boolean} awaitingResponse True when the chosen display name has been
 * sent to the server and a response is being awaited. Or when the current value
 * has been requested.
 * @prop {boolean} connected
 * @prop {string} displayName
 */

export {} // stops JSDoc comments from merging

/**
 * An screen to force the user to choose a display name before engaging with the
 * rest of the app.
 * @augments React.PureComponent<Props, State>
 */
export default class ChooseDisplayName extends React.PureComponent {
  /** @type {State} */
  state = {
    awaitingResponse: true,
    connected: false,
    displayName: '',
  }

  connUnsubscribe = () => {}
  focusUnsub = {
    remove() {},
  }

  componentDidMount() {
    this.connUnsubscribe = API.Events.onConnection(this.onConn)

    this.focusUnsub = this.props.navigation.addListener(
      'willFocus',
      this.onFocus,
    )
  }

  /**
   * @private
   * @returns {void}
   */
  onFocus = () => {
    API.Events.onDisplayName(
      debounce(
        once(dn => {
          if (dn !== null) {
            this.props.navigation.navigate('App')
          } else {
            this.setState({
              awaitingResponse: false,
            })
          }
        }),
        0,
      ),
    )
  }

  componentWillUnmount() {
    this.connUnsubscribe()
  }

  /**
   * @private
   * @param {string} displayName
   * @returns {void}
   */
  onChangeDisplayName = displayName => {
    this.setState({ displayName })
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
   * @returns {void}
   */
  onPressChoose = () => {
    this.setState(
      {
        awaitingResponse: true,
      },
      () => {
        API.Actions.setDisplayName(this.state.displayName)

        Promise.race([
          new Promise(res => {
            API.Events.onDisplayName(
              debounce(
                once(dn => {
                  res(dn)
                }),
                300,
              ),
            )
          }),
          new Promise(res => {
            setTimeout(() => {
              res(null)
            }, 5000)
          }),
        ])
          .then(dn => {
            this.setState(
              {
                awaitingResponse: false,
              },
              () => {
                if (dn === this.state.displayName) {
                  this.props.navigation.navigate(APP)
                }
              },
            )
          })
          .catch(e => {
            console.warn(e.message)

            this.setState({
              awaitingResponse: false,
            })
          })
      },
    )
  }

  render() {
    const { awaitingResponse, connected, displayName } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.shockWalletLogoContainer}>
          <Image style={SHOCK_LOGO_STYLE} source={shockLogo} />
          <Text style={styles.logoText}>S H O C K W A L L E T</Text>
        </View>

        {awaitingResponse && <ActivityIndicator animating size="large" />}

        {!awaitingResponse && (
          <View style={styles.shockWalletCallToActionContainer}>
            <Text style={styles.callToAction}>Choose a Display Name</Text>
          </View>
        )}

        {!awaitingResponse && (
          <View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={connected}
              onChangeText={this.onChangeDisplayName}
              placeholderTextColor="grey"
              placeholder="Display Name"
              style={styles.textInputField}
              value={displayName}
            />

            <ShockButton
              disabled={displayName.length === 0 || !connected}
              onPress={this.onPressChoose}
              title="Choose"
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
    // justifyContent: 'center',
    // marginBottom: 10,
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
