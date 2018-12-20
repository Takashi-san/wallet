'use strict';

import React, { Component } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import { Button, Icon } from 'react-native-elements';
// import { StackNavigator } from 'react-navigation';
// import { NavigationActions } from 'react-navigation';
// import config from '../../dev.config';
const storage = require('../../services/localStorage');

const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');

type Props = {};
export default class NewWallet extends Component<Props> {
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
      loading: false,
      errorMessage: ''
    }
  }

  componentDidMount() {
    storage.multiGet(['host'], (err, tokens) => {
      console.log('tokens', tokens);
      this.setState({
        host: tokens[0][1]
      });
    });
    // this.grabStoredData();
  }

  // grabStoredData(callback) {
  //   AsyncStorage.multiGet(['host'], (err, tokens) => {
  //     if (err) {
  //       throw new Error('Error occurred grabbbing host from local storage');
  //     }
  //     this.setState({
  //       host: tokens[0][1]
  //     }, () => {
  //       if (callback) {
  //         callback();
  //       }
  //     })
  //   });
  // }

  // data is an array of arrays (of strings)
  // e.g ['searchOnlineStores', 'true']
  saveDataToStorage(data, callback) {
    AsyncStorage.multiSet(data, (setError) => {
      if (setError) {
        return;
      } else {
        if (callback) {
          callback();
        }
      }
    });
  }

  passwordsAreTheSame() {
    if (this.state.password == this.state.confirmPassword) {
      return true;
    }
    return false;
  }

  createWallet() {
    if (!this.passwordsAreTheSame()) {
      this.setState({
        errorMessage: 'Passwords do not match'
      });
      return;
    }
    if (this.state.password.length < 8) {
      this.setState({
        errorMessage: 'Password must be at least 8 characters'
      });
      return;
    }
    if (this.state.walletName.length < 1) {
      this.setState({
        errorMessage: 'Please provide a name for the wallet'
      });
      return;
    }
    let endpoint = `${this.state.host}/api/lnd/wallet`;
    const payload = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      },
      body: JSON.stringify({
        password: this.state.password
      })
    };
    this.setState({loading: true});
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200 || res.status == 400) {
        return res.json();
      }
    })
    .then(res => {
      if (res.errorMessage) {
        this.setState({
          errorMessage: res.errorMessage
        });
        return;
      }
      console.log('res', res);
      let data = {
        key: 'wallet',
        data: {
          mnemonicPhrase: JSON.stringify(res.mnemonicPhrase),
          authorization: res.authorization,
          walletName: this.state.walletName,
          host: this.state.host
        },
        password: this.state.password
      };
      storage.encryptAndSet(data, () => {
        storage.getAndDecrypt({key: 'wallet', password: this.state.password}, (decryptedData) => {
            console.log('decryptedData', decryptedData);
        });
      });
      this.saveDataToStorage([['authorization', res.authorization]], () => {
        this.props.navigation.push('ConfirmPhrase', {mphrase: res.mnemonicPhrase});
      })
    })
    .catch(error => {
      this.setState({
        errorMessage: 'Something strange happened. Try again'
      });
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        loading: false
      });
    })
  }

  renderConnectButton() {
    if (this.state.loading) {
      return (
        <View style={{paddingVertical: 20}}>
          <ActivityIndicator animating size="large"/>
        </View>
      );
    } else {
      return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.createWallet()}>
          <View style={styles.createWalletButton}>
            <Text
              underlayColor={'transparent'}
              style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
            >Connect</Text>
          </View>
        </TouchableHighlight>
      );
    }
  }

  renderErrorMessage() {
    if (this.state.errorMessage) {
      return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.setState({errorMessage: ''})}>
          <View style={{height: 30, width: width, backgroundColor: '#f2604d', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>{this.state.errorMessage}</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <View style={{height: 30, width: width}}></View>
      );
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <KeyboardAwareScrollView>
          {this.renderErrorMessage()}
          <View style={styles.shockWalletLogoContainer}>
            <Image style={{width:100, height: 100}} source={require('../../assets/images/shocklogo.png')}/>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
            S H O C K W A L L E T
            </Text>
          </View>

          <View style={styles.shockWalletCallToActionContainer}>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 28}}>
            Enter Wallet Details
            </Text>
          </View>

          <View style={styles.formContainer}>
          <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({walletName: text})} autoCapitalize={"none"} placeholderTextColor="grey" autoCorrect={false} placeholder="Give your wallet a name"/>
          <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({password: text})} placeholderTextColor="grey" placeholder="Set a password" secureTextEntry={true}/>
          <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({confirmPassword: text})} placeholderTextColor="grey" placeholder="Confirm your password" secureTextEntry={true}/>
          {this.renderConnectButton()}
          </View>
          </KeyboardAwareScrollView>
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
    // paddingBottom: height / 10
  },
  shockWalletLogoContainer: {
    flex: 1,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height / 10,
  },
  shockWalletCallToActionContainer: {
    flex: 1,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: height / 20,
    flex: 2,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputField: {
    backgroundColor: '#ffffff',
    width: width / 1.3,
    height: 50,
    borderRadius: 5,
    padding: 5,
    marginBottom: 15
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
