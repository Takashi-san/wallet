'use strict';

import React, { Component } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackActions } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

const storage = require('../../services/localStorage');

const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');

type Props = {};
export default class ConnectToWallet extends Component<Props> {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#2E4674',
    }
  };
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params || {};
    this.state = {
      host: '',
      password: '',
      accessToken: '',
      loading: false,
      errorMessage: params.errorMessage ? params.errorMessage : ''
    }
  }

  componentDidMount() {
    let keys = [
      'host',
      'accessToken'
    ];
    storage.multiGet(keys, (err, tokens) => {
      console.log('tokens', tokens)
      this.setState({
        host: tokens[0][1],
        accessToken: tokens[1][1],
      });
    });
  }

  validHost() {
    if (/http:\/\//.test(this.state.host) || /https:\/\//.test(this.state.host)) {
      this.setState({
        errorMessage: ''
      });
      return true;
    } else {
      this.setState({
        errorMessage: 'Please prefix host with http:// or https://'
      });
      return false;
    }
  }

  initiateConnection() {
    console.log('this.state', this.state)
    if (!this.state.password) {
      this.setState({
        errorMessage: 'Please provide a password to unlock your wallet'
      });
      return;
    }
    // if (!this.validHost()) {
    //   return;
    // }
    storage.getAndDecrypt({key: 'wallet', password: this.state.password}, (err, decryptedData) => {
      // if (!err && decryptedData.host) {
      if (!err && decryptedData) {
        this.setState({
          // host: decryptedData.host,
          host: this.state.host,
          accessToken: decryptedData.authorization
        }, () => {
          this.connectToHost();
        })
      } else {
        this.setState({
          errorMessage: 'You do not have a wallet stored locally'
        });
        return;
      }
    });
  }

  validateProtocol() {
    console.log('this.state', this.state)
    if (this.state.host.indexOf("http://") == 0 || this.state.host.indexOf("https://") == 0) {
      return '';
    }
    return 'http://';
  }

  connectToHost() {
    let protocol = this.validateProtocol();
    let endpoint = `${protocol}${this.state.host}/api/lnd/connect`;
    const payload = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      },
      body: JSON.stringify({password: this.state.password})
    };
    this.setState({
      loading: true
    });
    fetch(endpoint, payload)
    .then(res => {
      console.log('res', res)
      if (res.status == 200 || res.status == 400 || res.status == 500) {
        return res.json();
      }
    })
    .then(res => {
      if (res.errorMessage) {
        this.errorHandler(res);
        return;
      }
      let data = [
        // ['host', `${protocol}${this.state.host}`],
        ['authorization', res.authorization],
      ];
      // this.saveDataToStorage(data, () => {
      //   this.props.navigation.push('LoggedInScreenNavigator');
      // })
      storage.multiSet(data, () => {
        // this.props.navigation.push('LoggedInScreenNavigator');
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'LoggedInScreenNavigator' })
          ],
        });
        this.props.navigation.dispatch(resetAction);
      });

    })
    .catch(error => {
      this.setState({
        errorMessage: "We couldn't connect to the host."
      });
    })
    .finally(() => {
      this.setState({
        loading: false,
      });
    })
  }

  errorHandler(res) {
    if (res.errorMessage == 'LND is down') {
      this.setState({
        errorMessage: 'LND is not running'
      });
    } else {
      this.setState({
        errorMessage: res.errorMessage
      });
    }
  }

  //
  // conectToHost() {
  //   if (!this.state.password) {
  //     this.setState({
  //       errorMessage: 'Please provide a password to unlock your wallet'
  //     });
  //     return;
  //   }
  //   let endpoint = `${this.state.host}/api/lnd/connect`;
  //   const payload = {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': this.state.accessToken
  //     },
  //     body: JSON.stringify({password: this.state.password})
  //   };
  //   this.setState({
  //     loading: true
  //   });
  //   fetch(endpoint, payload)
  //   .then(res => {
  //     if (res.status == 200 || res.status == 400) {
  //       return res.json();
  //     }
  //   })
  //   .then(res => {
  //     if (res.errorMessage) {
  //       this.setState({
  //         errorMessage: res.errorMessage
  //       });
  //       return;
  //     }
  //     let data = [
  //       ['authorization', res.authorization],
  //     ];
  //     // this.saveDataToStorage(data, () => {
  //     //   this.props.navigation.push('LoggedInScreenNavigator');
  //     // })
  //
  //     storage.multiSet(data, () => {
  //       this.props.navigation.push('LoggedInScreenNavigator');
  //     });
  //
  //   })
  //   .catch(error => {
  //     this.setState({
  //       errorMessage: 'Something strange happened. Are you connected to the internet?'
  //     });
  //   })
  //   .finally(() => {
  //     this.setState({
  //       loading: false,
  //     });
  //   })
  // }

  renderErrorMessage() {
    if (this.state.errorMessage) {
      return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.setState({errorMessage: ''})}>
          <View style={{height: 30, width: width, marginBottom: 10, backgroundColor: '#f2604d', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>{this.state.errorMessage}</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <View style={{height: 30, width: width, marginBottom: 10}}></View>
      );
    }
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
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.initiateConnection()}>
          <View style={styles.openExistingWalletButton}>
            <Text
              underlayColor={'transparent'}
              style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
            >Continue</Text>
          </View>
        </TouchableHighlight>
      );
    }
  }

  // <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({host: text})} placeholderTextColor="grey" placeholder="Host" autoCapitalize={"none"} autoCorrect={false}/>
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <KeyboardAwareScrollView>
            {this.renderErrorMessage()}
            <View style={styles.shockWalletLogoContainer}>
              <Image style={{width:80, height: 80}} source={require('../../assets/images/lock.png')}/>
            </View>

            <View style={styles.shockWalletCallToActionContainer}>
              <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 28}}>
              Unlock this Wallet
              </Text>
              <Text style={{color: '#DCDCDC', fontSize: 14, marginTop: 15}}>
              Enter your password to access
              </Text>
            </View>

            <View style={styles.formContainer}>
            <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({password: text})} placeholderTextColor="grey" placeholder="Password" secureTextEntry={true}/>
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
    paddingBottom: height / 10
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
    flex: 2,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height / 20
  },
  openExistingWalletButton: {
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
  textInputField: {
    backgroundColor: '#ffffff',
    width: width / 1.3,
    height: 50,
    borderRadius: 5,
    padding: 5,
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
