/**
 * @format
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

import debounce from 'lodash/debounce'
import once from 'lodash/once'
/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}, { awaitingRes: boolean }>} Navigation
 */

import ShockButton from '../components/ShockButton'
import ShockDialog from '../components/ShockDialog'

import * as API from '../services/contact-api'

const SUCCESS_MSG = 'Registration Sucessful'

export const REGISTER = 'REGISTER'

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
 * @prop {boolean} connected
 * @prop {string|null} msg
 * @prop {string} pass
 * @prop {string} repeatPass
 */

/**
 * @augments React.PureComponent<Props, State>
 */
export default class Register extends React.PureComponent {
  /**
   * @param {{ navigation: Navigation }} args
   * @returns {import('react-navigation').NavigationStackScreenOptions}
   */
  static navigationOptions = ({ navigation }) => {
    const awaitingRes = navigation.getParam('awaitingRes', false)

    return awaitingRes
      ? {
          headerLeft: null,
          gesturesEnabled: false,
          headerStyle: {
            backgroundColor: '#2E4674',
            elevation: 0,
          },
        }
      : {
          headerStyle: {
            backgroundColor: '#2E4674',
            elevation: 0,
          },
        }
  }

  connUnsubscribe = () => {}
  regUnsubscribe = () => {}

  /**
   * @type {State}
   */
  state = {
    alias: '',
    connected: false,
    msg: null,
    pass: '',
    repeatPass: '',
  }

  componentDidMount() {
    this.connUnsubscribe = API.Events.onConnection(this.onConn)
  }

  componentWillUnmount() {
    this.connUnsubscribe()
  }

  /**
   * @private
   */
  dismissDialog = () => {
    if (this.state.msg === SUCCESS_MSG) {
      this.props.navigation.goBack()
    }

    this.setState({
      msg: null,
    })
  }

  /**
   * @private
   * @param {string} alias
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
   * @param {string} repeatPass
   * @returns {void}
   */
  onChangeRepeatPass = repeatPass => {
    this.setState({ repeatPass })
  }

  /**
   * @private
   * @returns {void}
   */
  onPressRegister = () => {
    this.props.navigation.setParams({
      awaitingRes: true,
    })

    const resFromServer = new Promise(resolve => {
      API.Events.onRegister(
        debounce(
          once(res => {
            resolve(res)
          }),
          300,
        ),
      )
    })

    API.Actions.register(this.state.alias, this.state.pass)

    const timeout = new Promise(res => {
      setTimeout(() => {
        /** @type {API.Events._RegisterListenerDataBAD} */
        const r = {
          alias: this.state.alias,
          msg: 'Did not receive a response from the server on time.',
          ok: false,
          pass: this.state.pass,
        }

        res(r)
      }, 3000)
    })

    Promise.race([resFromServer, timeout])
      .then((/** @type {API.Events.RegisterListenerData} */ res) => {
        if (res.ok) {
          this.setState({
            msg: SUCCESS_MSG,
          })
        } else {
          this.setState({
            msg: res.msg,
          })

          this.props.navigation.setParams({
            awaitingRes: false,
          })
        }
      })
      .catch(e => {
        this.setState({
          msg: e.message,
        })

        this.props.navigation.setParams({
          awaitingRes: false,
        })
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

  render() {
    const { alias, connected, msg, pass, repeatPass } = this.state
    const awaitingRes = this.props.navigation.getParam('awaitingRes', false)

    return (
      <View style={styles.container}>
        <View style={styles.shockWalletLogoContainer}>
          <Image style={SHOCK_LOGO_STYLE} source={shockLogo} />
          <Text style={styles.logoText}>S H O C K W A L L E T</Text>
        </View>

        {awaitingRes && <ActivityIndicator animating size="large" />}

        {!awaitingRes && (
          <View style={styles.center}>
            <Text style={styles.callToAction}>Register</Text>
          </View>
        )}

        {!awaitingRes && (
          <View>
            <TextInput
              editable={connected}
              style={styles.textInputField}
              onChangeText={this.onChangeAlias}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="grey"
              placeholder="Choose alias"
              value={alias}
            />

            <TextInput
              editable={connected}
              style={styles.textInputField}
              onChangeText={this.onChangePass}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="grey"
              placeholder="Enter a Pass"
              textContentType="password"
              value={pass}
            />

            <TextInput
              editable={connected}
              style={styles.textInputField}
              onChangeText={this.onChangeRepeatPass}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="grey"
              placeholder="Repeat your Pass"
              textContentType="password"
              value={repeatPass}
            />

            <ShockButton
              disabled={
                !connected ||
                pass !== repeatPass ||
                pass.length === 0 ||
                alias.length === 0
              }
              fullWidth
              onPress={this.onPressRegister}
              title="Register"
            />
          </View>
        )}

        <ShockDialog
          message={msg}
          onRequestClose={this.dismissDialog}
          visible={!!msg}
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
  center: {
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
