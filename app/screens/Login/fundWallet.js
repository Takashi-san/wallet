'use strict';

import React, { Component } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, Keyboard, Linking, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import QRCode from 'react-native-qrcode';
// import { Button, Icon } from 'react-native-elements';
// import { StackNavigator } from 'react-navigation';
// import { NavigationActions } from 'react-navigation';
// import config from '../../dev.config';

// const AsyncStorage = require('react-native').AsyncStorage;
const storage = require('../../services/localStorage');

const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');

type Props = {};
export default class FundWallet extends Component<Props> {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#2E4674',
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      host: '',
      newAddress: null,
      accessToken: ''
    }
  }

  componentDidMount() {

    let keys = [
      'host',
      'authorization',
      'walletName',
      'mnemonicPhrase'
    ];
    storage.multiGet(keys, (err, tokens) => {
      this.setState({
        host: tokens[0][1],
        accessToken: tokens[1][1],
      }, () => {
        this.getNewAddress();
      });
    });
  }

  goHome() {
    this.props.navigation.push('LoggedInScreenNavigator')
  }

  getNewAddress() {
    let endpoint = `${this.state.host}/api/lnd/newaddress`;
    const payload = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      },
      body: JSON.stringify({
        'type': ["NESTED_PUBKEY_HASH", "WITNESS_PUBKEY_HASH"][Math.floor(Math.random() * 2)]
      })
    };
    console.log(endpoint, payload);
    fetch(endpoint, payload)
    .then(res => {
      console.log('res', res)
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      console.log(res);
      this.setState({
        newAddress: `bitcoin:${res.address}?label=fund%20lightning%20wallet`
      });
    })
    .catch(error => {
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        newAddressIsLoading: false,
      });
    })
  }

  openAddress() {
    if (!this.state.newAddress) {
      return;
    }
    Linking.canOpenURL(this.state.newAddress).then(supported => {
      if (!supported) {
        return;
      } else {
        return Linking.openURL(this.state.newAddress);
      }
    }).catch(err => {
      console.log('err', err);
    });
  }

  renderQRCode() {
    console.log('this.state', this.state)
    if (this.state.newAddress) {
      console.log('renderQRCode')
      return (
        <TouchableHighlight style={styles.formContainer} underlayColor={'transparent'} onPress={() => this.openAddress()}>
          <View style={styles.formContainer}>
            <QRCode
              value={this.state.newAddress}
              size={200}
              bgColor='#2E4674'
              fgColor='white'/>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
        <View style={{paddingVertical: 20}}>
          <ActivityIndicator animating size="large"/>
        </View>
      );
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.shockWalletLogoContainer}>
            <Image style={{width:100, height: 100}} source={require('../../assets/images/shocklogo.png')}/>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 20, marginTop: 10}}>
            S H O C K W A L L E T
            </Text>
          </View>

          {this.renderQRCode()}

          <TouchableHighlight underlayColor={'transparent'} onPress={() => this.goHome()}>
            <View style={styles.createWalletButton}>
              <Text
                underlayColor={'transparent'}
                style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
              >Home</Text>
            </View>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
      );
    }

  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2E4674',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: height / 10,
      paddingBottom: height / 10
    },
    shockWalletLogoContainer: {
      flex: 1,
      backgroundColor: '#2E4674',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    shockWalletCallToActionContainer: {
      flex: 1,
      backgroundColor: '#2E4674',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      flex: 2,
      backgroundColor: '#2E4674',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    createWalletButton: {
      height: 50,
      width: width / 1.3,
      borderWidth: 0.5,
      backgroundColor: '#F5A623',
      borderColor: '#F5A623',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15
    },
    useShockWalletButton: {
      height: 50,
      width: width / 1.3,
      borderWidth: 0.5,
      backgroundColor: '#50668F',
      borderColor: '#50668F',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitBtnText: {
      color: 'white',
      fontWeight: 'bold'
    },
  })
