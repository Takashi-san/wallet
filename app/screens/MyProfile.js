/** @format */
import React from 'react'

import {
  Clipboard,
  Text,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native'
import { View } from 'react-native'
import EntypoIcons from 'react-native-vector-icons/Entypo'

import * as API from '../services/contact-api'
import ShockAvatar from '../components/ShockAvatar'
import ShockButton from '../components/ShockButton'
import QR from './WalletOverview/QR'
import Pad from '../components/Pad'
import BasicDialog from '../components/BasicDialog'
import ShockInput from '../components/ShockInput'
import IGDialogBtn from '../components/IGDialogBtn'

export const MY_PROFILE = 'MY_PROFILE'

const showCopiedToClipboardToast = () => {
  ToastAndroid.show('Copied to clipboard!', 800)
}

/**
 * @typedef {object} State
 * @prop {API.Events.AuthData} authData
 * @prop {string|null} displayName
 * @prop {boolean} displayNameDialogOpen
 * @prop {string} displayNameInput
 * @prop {string|null} handshakeAddr
 */

/**
 * @augments React.PureComponent<{}, State, never>
 */
export default class MyProfile extends React.PureComponent {
  /**
   * @type {import('react-navigation').NavigationBottomTabScreenOptions}
   */
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => {
      return ((
        <EntypoIcons
          color={tintColor === null ? undefined : tintColor}
          name="user"
          // reverseColor={'#CED0CE'}
          size={22}
        />
      ))
    },
  }

  /** @type {State} */
  state = {
    authData: null,
    displayName: null,
    displayNameDialogOpen: false,
    displayNameInput: '',
    handshakeAddr: null,
  }

  onAuthDataUnsub = () => {}
  onDisplayNameUnsub = () => {}
  onHandshakeAddressUnsub = () => {}

  componentDidMount() {
    this.onAuthDataUnsub = API.Events.onAuth(ad => {
      this.setState({
        authData: ad,
      })
    })
    this.onDisplayNameUnsub = API.Events.onDisplayName(dn => {
      this.setState({
        displayName: dn,
      })
    })
    this.onHandshakeAddressUnsub = API.Events.onHandshakeAddr(addr => {
      this.setState({
        handshakeAddr: addr,
      })
    })
  }

  componentWillUnmount() {
    this.onAuthDataUnsub()
    this.onDisplayNameUnsub()
    this.onHandshakeAddressUnsub()
  }

  /**
   * @param {string} dn
   */
  onChangeDisplayNameInput = dn => {
    this.setState({
      displayNameInput: dn,
    })
  }

  toggleSetupDisplayName = () => {
    this.setState(({ displayNameDialogOpen }) => ({
      displayNameDialogOpen: !displayNameDialogOpen,
      displayNameInput: '',
    }))
  }

  setDisplayName = () => {
    API.Actions.setDisplayName(this.state.displayNameInput)
    this.toggleSetupDisplayName()
  }

  genHandAddr = () => {
    API.Actions.generateNewHandshakeNode()
  }

  copyDataToClipboard = () => {
    const { authData, displayName, handshakeAddr } = this.state

    if (authData === null) {
      return
    }

    const data = `$$__SHOCKWALLET__USER__${
      authData.publicKey
    }__${handshakeAddr}__${displayName ? displayName : authData.publicKey}`

    Clipboard.setString(data)

    showCopiedToClipboardToast()
  }

  render() {
    const {
      displayName,
      authData,
      handshakeAddr,
      displayNameInput,
      displayNameDialogOpen,
    } = this.state

    if (authData === null) {
      return <ActivityIndicator size="large" />
    }

    return (
      <View style={styles.container}>
        <ShockAvatar displayName={displayName} height={320} image={null} />

        {displayName === null && (
          <ShockButton
            title="Press here to set up a display name"
            onPress={this.toggleSetupDisplayName}
          />
        )}

        {handshakeAddr === null && (
          <React.Fragment>
            <Text>
              No Handshake Address. A handshake address is necessary for being
              contacted by other users.
            </Text>
            <Pad amount={10} />

            <View style={{ maxWidth: '75%' }}>
              <ShockButton
                title="Press to Generate a New One"
                onPress={this.genHandAddr}
              />
            </View>
          </React.Fragment>
        )}

        {handshakeAddr !== null && (
          <View style={styles.QRHolder}>
            <Text>Other users can scan this QR to contact you.</Text>
            <Pad amount={10} />
            <QR
              size={256}
              logoToShow="shock"
              value={`$$__SHOCKWALLET__USER__${
                authData.publicKey
              }__${handshakeAddr}__${
                displayName ? displayName : authData.publicKey
              }`}
            />
            <Pad amount={10} />
            <ShockButton
              onPress={this.copyDataToClipboard}
              title="Copy raw data to clipboard (use this if your QR cannot be scanned)"
            />
          </View>
        )}

        <BasicDialog
          onRequestClose={this.toggleSetupDisplayName}
          title="Display Name"
          visible={displayNameDialogOpen}
        >
          <View style={styles.dialog}>
            <ShockInput
              onChangeText={this.onChangeDisplayNameInput}
              value={displayNameInput}
            />

            <IGDialogBtn
              disabled={displayNameInput.length === 0}
              title="OK"
              onPress={this.setDisplayName}
            />
          </View>
        </BasicDialog>
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

  dialog: {
    alignItems: 'stretch',
  },

  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },

  QRHolder: {
    alignItems: 'center',
    flex: 1,
  },
})
