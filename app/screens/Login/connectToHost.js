'use strict';

import React, { Component } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { CheckBox } from 'react-native-elements';
// import { StackNavigator } from 'react-navigation';
// import { NavigationActions } from 'react-navigation';
// import config from '../../dev.config';

const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');

type Props = {};
export default class ConnectToHost extends Component<Props> {
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
      errorMessage: '',
      localIp: '',
      internetIp: '',
      localPort: '',
      internetPort: ''
    }
  }

  componentDidMount() {

  }

  // data is an array of arrays (of strings)
  // e.g ['searchOnlineStores', 'true']
  saveDataToStorage(data, callback) {
    console.log('data', data);
    AsyncStorage.multiSet(data, (setError) => {
      if (setError) {
        return;
      } else {
        callback();
      }
    });
  }

  validateProtocol() {
    if (this.state.host.indexOf("http://") == 0 || this.state.host.indexOf("https://") == 0) {
      return '';
    }
    return 'http://';
  }

  conectToHost() {
    let protocol = this.validateProtocol();
    let endpoint = `${protocol}${this.state.host}/api/lnd/connect`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    this.setState({
      loading: true
    });
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
      let data = [
        ['host', `${protocol}${this.state.host}`]
      ];
      this.saveDataToStorage(data, () => {
        this.props.navigation.push('NewWallet');
      })
    })
    .catch(error => {
      this.setState({
        errorMessage: "We couldn't connect to the host."
      });
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        loading: false,
      });
    })
  }

  useShockWallet() {
    console.log('useShockWallet')
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

  renderErrorMessage() {
    if (this.state.errorMessage) {
      return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.setState({errorMessage: ''})}>
          <View style={{height: 30, width: width, backgroundColor: '#f2604d', marginBottom: height / 10, justifyContent: 'center', alignItems: 'center'}}>
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

  renderConnectButton() {
    if (this.state.loading) {
      return (
        <View style={{paddingVertical: 20}}>
          <ActivityIndicator animating size="large"/>
        </View>
      );
    } else {
      return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.conectToHost()}>
          <View style={styles.openExistingWalletButton}>
            <Text
              underlayColor={'transparent'}
              style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
            >Connect</Text>
          </View>
        </TouchableHighlight>
      );
    }
  }

  render() {
    // return (
    //     <View style={styles.container}>
    //       <KeyboardAwareScrollView style={{flex: 1}}>
    //         {this.renderErrorMessage()}
    //
    //         <View style={styles.shockWalletLogoContainer}>
    //           <Image style={{width:80, height: 80}} source={require('../../assets/images/logo.png')}/>
    //           <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
    //           S H O C K W A L L E T
    //           </Text>
    //         </View>
    //
    //         <View style={styles.shockWalletCallToActionContainer}>
    //           <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 28}}>
    //           Node Setup
    //           </Text>
    //         </View>
    //
    //         <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
    //           <View style={{padding: 5, borderRadius: 15,flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start',backgroundColor: '#3B7BD4'}}>
    //             <Text adjustsFontSizeToFit={true} style={{paddingLeft: 5, paddingRight: 5,color: '#f0f0f0'}}>Network</Text>
    //             <Text adjustsFontSizeToFit={true} style={{color: '#f0f0f0'}}>|</Text>
    //             <Text adjustsFontSizeToFit={true} style={{paddingLeft: 5, paddingRight: 5,color: '#f0f0f0'}}>Wallet Devices</Text>
    //             <Text adjustsFontSizeToFit={true} style={{color: '#f0f0f0'}}>|</Text>
    //             <Text adjustsFontSizeToFit={true} style={{paddingLeft: 5, paddingRight: 5,color: '#f0f0f0'}}>Advanced Tools</Text>
    //           </View>
    //         </View>
    //         <View style={styles.formContainer}>
    //           <View style={{borderRadius: 15, paddingTop: 15, paddingBottom: 15, justifyContent: 'flex-start', alignItems: 'flex-start',backgroundColor: '#56688D', margin: 15}}>
    //             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    //               <Text style={{margin: 15, color: '#f0f0f0'}}>Network Configuration</Text>
    //             </View>
    //             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    //               <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({localIp: text})} autoCapitalize={"none"} autoCorrect={false} placeholderTextColor="grey" placeholder="Local IP"/>
    //               <CheckBox
    //                 center
    //                 title='Automatic'
    //                 containerStyle={{backgroundColor: '#56688D', padding: 0, borderColor: '#56688D'}}
    //                 checkedIcon='dot-circle-o'
    //                 uncheckedIcon='circle-o'
    //                 checked={true}
    //                 iconRight={true}
    //                 checkedColor='#F5A623'
    //                 uncheckedColor='white'
    //                 textStyle={{color: 'white'}}
    //               />
    //               <CheckBox
    //                 center
    //                 title='Static'
    //                 containerStyle={{backgroundColor: '#56688D', padding: 0, borderColor: '#56688D'}}
    //                 checkedIcon='dot-circle-o'
    //                 uncheckedIcon='circle-o'
    //                 checked={false}
    //                 iconRight={true}
    //                 checkedColor='#F5A623'
    //                 uncheckedColor='white'
    //                 textStyle={{color: 'white'}}
    //               />
    //             </View>
    //             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    //               <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({internetIp: text, host: text})} autoCapitalize={"none"} autoCorrect={false} placeholderTextColor="grey" placeholder="Internet IP"/>
    //               <CheckBox
    //                 center
    //                 title='Use Dynamic DNS'
    //                 containerStyle={{backgroundColor: '#56688D', borderColor: '#56688D'}}
    //                 checkedIcon='dot-circle-o'
    //                 uncheckedIcon='circle-o'
    //                 checked={true}
    //                 iconRight={true}
    //                 checkedColor='#F5A623'
    //                 uncheckedColor='white'
    //                 textStyle={{color: 'white'}}
    //               />
    //             </View>
    //             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    //               <Text style={{margin: 15, color: '#f0f0f0',fontSize: 12}}>Dynamic DNS is a free IP updating service that is recommended for most residential internet connections.</Text>
    //             </View>
    //             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    //               <Text style={{margin: 15, color: '#f0f0f0', fontWeight: "bold"}}>Ports</Text>
    //               <TextInput style={styles.portInput} onChangeText={(text) => this.setState({localPort: text})} autoCapitalize={"none"} autoCorrect={false}/>
    //               <Text style={{margin: 5, color: '#f0f0f0'}}>+</Text>
    //               <TextInput style={styles.portInput} onChangeText={(text) => this.setState({internetPort: text})} autoCapitalize={"none"} autoCorrect={false}/>
    //             </View>
    //             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    //               <Text style={{margin: 15, color: '#f0f0f0',fontSize: 12}}>Allow/Open these ports in your Router/Modem Firewall. "Forward" these ports to your Local IP.</Text>
    //             </View>
    //           </View>
    //
    //         </View>
    //
    //         <View style={{justifyContent: 'center', alignItems: 'center', margin: 15}}>
    //           {this.renderConnectButton()}
    //         </View>
    //
    //       </KeyboardAwareScrollView>
    //
    //     </View>
    //
    // );
    return (
      <View style={styles.container}>
        {this.renderErrorMessage()}
        <View style={styles.shockWalletLogoContainer}>
          <Image style={{width:100, height: 100}} source={require('../../assets/images/shocklogo.png')}/>
          <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 20, marginTop: 10}}>
          S H O C K W A L L E T
          </Text>
        </View>
         <View style={styles.shockWalletCallToActionContainer}>
          <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 28}}>
          Create a Wallet
          </Text>
        </View>
         <View style={styles.formContainer}>
        <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({host: text})} autoCapitalize={"none"} autoCorrect={false} placeholderTextColor="grey" placeholder="Specify Node IP"/>
        {this.renderConnectButton()}
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.useShockWallet()}>
          <View style={styles.useShockWalletButton}>
            <Text
              underlayColor={'transparent'}
              style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
            >Use Shock Cloud</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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

//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#2E4674',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     // paddingBottom: height / 10
//   },
//   shockWalletLogoContainer: {
//     flex: 1,
//     backgroundColor: '#2E4674',
//     justifyContent: 'center',
//     alignItems: 'center',
//     // marginBottom: height / 10,
//   },
//   shockWalletCallToActionContainer: {
//     flex: 1,
//     backgroundColor: '#2E4674',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   formContainer: {
//     // marginTop: height / 20,
//     flex: 2,
//     backgroundColor: '#2E4674',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   portInput: {
//     backgroundColor: '#ffffff',
//     width: width / 5,
//     height: 25,
//     borderRadius: 25,
//     padding: 5,
//     // marginBottom: 15,
//     // justifyContent: 'center',
//     // alignItems: 'center'
//   },
//   openExistingWalletButton: {
//     height: 30,
//     width: width / 3,
//     borderWidth: 0.5,
//     backgroundColor: '#F5A623',
//     borderColor: '#F5A623',
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15
//   },
//   useShockWalletButton: {
//     height: 50,
//     width: width / 1.3,
//     borderWidth: 0.5,
//     backgroundColor: '#50668F',
//     borderColor: '#50668F',
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   submitBtnText: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
// })
