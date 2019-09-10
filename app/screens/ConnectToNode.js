/**
 * @prettier
 */
import React from 'react'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'

import ShockButton from '../components/ShockButton'

/**
 * @typedef {import('react-navigation').NavigationScreenProp<{}>} Navigation
 */

/**
 * @param {string} ip
 */
const isValidIP = ip => {
  const sections = ip.split('.')

  if (sections.length !== 4) return false

  return sections.every(
    s => Number.isInteger(Number(s)) && s.length <= 3 && s.length > 0,
  )
}

const SHOCK_LOGO_STYLE = { width: 100, height: 100 }

/** @type {number} */
// @ts-ignore
const shockLogo = require('../assets/images/shocklogo.png')

/**
 * @typedef {object} Props
 * @prop {boolean} disableControls
 * @prop {(ip: string) => void} onPressConnect
 * @prop {() => void} onPressUseShockcloud
 */

/**
 * @typedef {object} State
 * @prop {string} nodeIP
 */

/**
 * @augments React.PureComponent<Props, State, never>
 */
export default class ConnectToNode extends React.PureComponent {
  /**
   * @type {import('react-navigation').NavigationScreenOptions}
   */
  static navigationOptions = {
    header: null,
  }

  /** @type {State} */
  state = {
    nodeIP: '',
  }

  /**
   * @private
   * @param {string} nodeIP
   */
  onChangeNodeIP = nodeIP => {
    this.setState({
      nodeIP,
    })
  }

  /** @private */
  onPressConnect = () => {
    this.props.onPressConnect(this.state.nodeIP)
  }

  render() {
    const { nodeIP } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.shockWalletLogoContainer}>
          <Image style={SHOCK_LOGO_STYLE} source={shockLogo} />
          <Text style={styles.logoText}>S H O C K W A L L E T</Text>
        </View>

        <View style={styles.shockWalletCallToActionContainer}>
          <Text style={styles.callToAction}>Connect to a Node</Text>
        </View>

        <View>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!this.props.disableControls}
            onChangeText={this.onChangeNodeIP}
            placeholder="Specify Node IP"
            placeholderTextColor="grey"
            style={styles.textInputField}
            value={nodeIP}
          />

          <ShockButton
            disabled={!isValidIP(nodeIP) || this.props.disableControls}
            onPress={this.onPressConnect}
            title="Connect"
          />

          <ShockButton
            disabled={this.props.disableControls}
            color="grey"
            onPress={this.props.onPressUseShockcloud}
            title="Use Shock Cloud"
          />
        </View>
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
