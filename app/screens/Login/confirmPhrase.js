'use strict';

import React, { Component } from 'react';
import { Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
// import { Button, Icon } from 'react-native-elements';
// import { StackNavigator } from 'react-navigation';
// import { NavigationActions } from 'react-navigation';
// import config from '../../dev.config';

// const AsyncStorage = require('react-native').AsyncStorage;
const storage = require('../../services/localStorage');

const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');

type Props = {};
export default class ConfirmPhrase extends Component<Props> {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#2E4674',
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      confirmPassword: '',
      host: '',
      password: '',
      walletName: '',
      mnemonicPhrase: []
    }
  }

  componentDidMount() {
    this.setState({
      mnemonicPhrase: this.props.navigation.state.params.mphrase || []
    })
  }


  confirmPhrase() {
    this.props.navigation.push('FundWallet')
  }

    render() {
      return (
        <View style={styles.container}>
          <View style={styles.shockWalletLogoContainer}>
            <Image style={{width:100, height: 100}} source={require('../../assets/images/shocklogo.png')}/>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 20, marginTop: 10}}>
            S H O C K W A L L E T
            </Text>
          </View>

          <View style={styles.shockWalletCallToActionContainer}>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 28}}>
            Write down your
            </Text>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 28}}>
            recovery phrase
            </Text>
          </View>

          <View style={styles.formContainer}>
          <Text style={{justifyContent: 'center', alignItems: 'center', width: width / 1.3, margin: 15, color: '#ffffff', fontWeight: 'bold', fontSize: 14, borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 15}}>{this.state.mnemonicPhrase.join(", ")}</Text>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => this.confirmPhrase()}>
            <View style={styles.createWalletButton}>
              <Text
                underlayColor={'transparent'}
                style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
              >Confirm</Text>
            </View>
          </TouchableHighlight>
          </View>
        </View>
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
