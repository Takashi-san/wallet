/** @format */
import React from 'react'

import { Text, StyleSheet, ActivityIndicator } from 'react-native'
import { View } from 'react-native'
import EntypoIcons from 'react-native-vector-icons/Entypo'

import * as API from '../services/contact-api'
import ShockAvatar from '../components/ShockAvatar'
import ShockButton from '../components/ShockButton'
import QR from './WalletOverview/QR'
import Pad from '../components/Pad'

export const MY_PROFILE = 'MY_PROFILE'

/**
 * @typedef {object} State
 * @prop {API.Events.AuthData} authData
 * @prop {string|null} displayName
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
    handshakeAddr: null,
  }

  onAuthDataUnsub = () => {}
  onDisplayNameUnsub = () => {}
  onHandshakeAddressUnsub = () => {}

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        authData: {
          publicKey: 'pk',
          token: 'token',
        },
        displayName: 'John',
      })
    }, 500)
    {
      // this.onAuthDataUnsub = API.Events.onAuth(ad => {
      //   if (ad === null) {
      //     return
      //   }
      //   this.setState({
      //     authData: ad,
      //   })
      // })
      // this.onDisplayNameUnsub = API.Events.onDisplayName(dn => {
      //   this.setState({
      //     displayName: dn,
      //   })
      // })
      // this.onHandshakeAddressUnsub = API.Events.onHandshakeAddr(addr => {
      //   this.setState({
      //     handshakeAddr: addr,
      //   })
      // })
    }
  }

  componentWillUnmount() {
    this.onAuthDataUnsub()
    this.onDisplayNameUnsub()
    this.onHandshakeAddressUnsub()
  }

  genHandAddr = () => {
    setTimeout(() => {
      this.setState({
        handshakeAddr: 'jaksljdklasjfhaskjdhkj',
      })
    }, 100)

    // API.Actions.generateNewHandshakeNode()
  }

  render() {
    const { displayName, authData, handshakeAddr } = this.state

    if (authData === null) {
      return <ActivityIndicator size="large" />
    }

    return (
      <View style={styles.container}>
        <ShockAvatar displayName={displayName} height={180} image={null} />

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
          <View style={{ maxWidth: '75%', alignItems: 'center' }}>
            <Text>Other users can scan this QR to contact you.</Text>
            <Pad amount={10} />
            <QR
              logoToShow="shock"
              value={`$$__SHOCKWALLET__USER__${
                authData.publicKey
              }__${handshakeAddr}__${displayName}`}
            />
          </View>
        )}
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
