'use strict';

import React, { Component } from 'react';
import { Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { StackActions } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
// import { Button, Icon } from 'react-native-elements';
// import config from '../../dev.config';
// const AsyncStorage = require('react-native').AsyncStorage;
import ShockButton from '../../components/ShockButton';
import { Colors } from '../../css';

const { width, height } = Dimensions.get('window');
const storage = require('../../services/localStorage');

type Props = {};
export default class LoginScreen extends Component<Props> {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      confirmPassword: '',
      host: '',
      accessToken: '',
      password: '',
      walletName: '',
      loading: false
    }
  }

  componentDidMount() {
    this.checkIfAuthorized();
  }

  checkIfAuthorized() {
    storage.multiGet(['host', 'authorization', 'wallet'], (err, results) => {
      console.log('err, ', err);
      console.log('results, ', results);
      if (results) {
        this.setState({
          host: results[0][1] ? results[0][1] : '',
          accessToken: results[1][1] ? results[1][1] : '',
          walletExists: results[2][1] ? results[2][1] : ''
        }, () => {
          this.connectToHost();
        })
      }
    });
  }

  connectToHost() {
    if (this.state.walletExists) {
      this.props.navigation.push('ConnectToWallet');
    }
  }

  // connectToHost() {
  //   if (!this.state.host) {
  //     return;
  //   }
  //   this.setState({
  //     errorMessage: ''
  //   });
  //   let endpoint = `${this.state.host}/api/lnd/auth`;
  //   const payload = {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': this.state.accessToken
  //     },
  //   };
  //   console.log('payload', payload);
  //   console.log('endpoint', endpoint);
  //   this.setState({
  //     loading: true
  //   });
  //   fetch(endpoint, payload)
  //   .then(res => {
  //     if (res.status == 200 || res.status == 400 || res.status == 500) {
  //       return res.json();
  //     }
  //   })
  //   .then(res => {
  //     console.log('res', res);
  //     if (res.errorMessage) {
  //       this.errorHandler(res);
  //       return;
  //     }
  //     let data = [
  //       ['authorization', res.authorization],
  //     ];
  //     console.log('res', res);
  //     storage.multiSet(data, () => {
  //       // this.props.navigation.push('LoggedInScreenNavigator');
  //       const resetAction = StackActions.reset({
  //         index: 0,
  //         actions: [
  //           NavigationActions.navigate({ routeName: 'LoggedInScreenNavigator' })
  //         ],
  //       });
  //       this.props.navigation.dispatch(resetAction);
  //     });
  //
  //   })
  //   .catch(error => {
  //     console.log('error', error)
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

  errorHandler(res) {
    console.log('fuck', res.status)
    console.log('fuck', res.errorMessage)
    if (res.errorMessage == 'LND is down') {
      console.log('this.state', this.state);
      if (this.state.walletExists) {
        this.props.navigation.push('ConnectToWallet', {errorMessage: 'Please unlock your wallet'});
      }
    } else {
      this.setState({
        errorMessage: res.errorMessage
      });
    }
  }

  createNewWallet() {
    this.props.navigation.push('ConnectToHost');
  }

  openExisitingWallet() {
    // this.props.navigation.push('LoggedInScreenNavigator');
    this.props.navigation.push('ConnectToWallet');
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
        <View
          style={{
            position: 'absolute',
            top: -20,
            left: 0,
            width: width,
            height: height,
          }}
        >
        <Image
          resizeMode={'contain'}
          style={{
            width: width
          }}
          source={require('../../assets/images/mapworld_white.png')}
        />
        </View>
          <View style={styles.shockWalletLogoContainer}>
          </View>
          <View style={styles.shockWalletLogoContainer}>
            <Image style={{width:80, height: 80}} source={require('../../assets/images/shocklogo.png')}/>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18, marginTop: 5}}>
              S H O C K W A L L E T
            </Text>
          </View>
          <View style={styles.actionOptionsContainer}>
            <ShockButton
              color={Colors.BLUE_GRAY} 
              fullWidth 
              title={'Open Existing Wallet'} 
              />
            <TouchableHighlight underlayColor={'transparent'} onPress={() => this.createNewWallet()}>
              <View style={styles.createNewWalletButton}>
                <Text
                  underlayColor={'transparent'}
                  style={{color: '#ffffff', fontWeight: 'bold', fontSize: 16}}
                >Create New Wallet</Text>
              </View>
            </TouchableHighlight>
          </View>
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
    // backgroundColor: '#2E4674',
    backgroundColor: 'rgba(52, 52, 52, 0.0)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionOptionsContainer: {
    flex: 1,
    // backgroundColor: '#2E4674',
    backgroundColor: 'rgba(52, 52, 52, 0.0)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
  createNewWalletButton: {
    alignItems: 'center',
    backgroundColor: '#50668F',
    borderColor: '#50668F',
    borderRadius: 5,
    borderWidth: 0.5,
    height: 50,
    justifyContent: 'center',
    width: width / 1.3
  },
  submitBtnText: {
    color: 'white',
    fontWeight: 'bold'
  },
})
