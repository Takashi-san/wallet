'use strict';

import React, { Component } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import { StackActions } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { Avatar } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const storage = require('../../services/localStorage');
const errorReporter = require('../../services/errorReporter');
// import config from '../../dev.config';

const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');

type Props = {};
export default class EditProfileScreen extends Component<Props> {
  static navigationOptions = (state) => {
    console.log('axaxa', state.navigation.state);
    return {
      headerStyle: {
        backgroundColor: '#315393',
      },
      title: '',
      headerBackTitle: null,
      mode: 'modal',
      openOptionsModal: false
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      errorMessage: '',
      loading: false,
      name: '',
      bio: ''
    }
  }

  componentDidMount() {
    let keys = [
      'host',
      'authorization'
    ];
    storage.multiGet(keys, (err, tokens) => {
      this.setState({
        host: tokens[0][1],
        accessToken: tokens[1][1],
      }, () => {
        this.setHeader();
      });
    });
  }

  setHeader() {
    console.log('fuck', this.props.navigation);
      this.props.navigation.setParams({
        title: <Text style={{color: '#000000', fontFamily: 'Heebo', fontWeight: 'bold', fontSize: 18}}>{this.state.name}</Text>,
        headerRight: <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => this.props.navigation.push('EditProfile')}
          style={{height: "100%", width:80, alignItems: 'flex-end', justifyContent: 'center'}}>
          <View>
            <Text style={{fontWeight: 'bold', color: '#000000', marginRight: 15}}>Edit</Text>
          </View>
        </TouchableHighlight>
      });
  }

  logout() {
    let keys = ['host', 'authorization'];
    AsyncStorage.multiRemove(keys, (err) => {
      if (err) {
        console.log('err', err);
      } else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login' })
          ],
        });
        this.props.navigation.dispatch(resetAction);
      }
    });
  }

  editProfile() {
    if (!this.state.name) {
      this.setState({
        errorMessage: 'Please provide a name'
      });
      return;
    }
    if (!this.state.bio) {
      this.setState({
        errorMessage: 'Please provide a bio'
      });
      return;
    }
    this.setState({
      errorMessage: ''
    });
    let endpoint = `${this.state.host}/api/static/profile`;
    const payload = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      },
      body: JSON.stringify({
        name: this.state.name,
        bio: this.state.bio
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
      // let data = {
      //   key: 'wallet',
      //   data: {
      //     mnemonicPhrase: JSON.stringify(res.mnemonicPhrase),
      //     authorization: res.authorization,
      //     walletName: this.state.walletName,
      //     host: this.state.host
      //   },
      //   password: this.state.password
      // };
      // storage.encryptAndSet(data, () => {
      //   storage.getAndDecrypt({key: 'wallet', password: this.state.password}, (decryptedData) => {
      //       console.log('decryptedData', decryptedData);
      //   });
      // });
      // this.saveDataToStorage([['authorization', res.authorization]], () => {
      //   this.props.navigation.push('ConfirmPhrase', {mphrase: res.mnemonicPhrase});
      // })
      this.props.navigation.dispatch(NavigationActions.back());
    })
    .catch(error => {
      this.setState({
        errorMessage: 'Something strange happened. Try again'
      });
      errorReporter(this.state.host, this.state.accessToken, error);
      console.log('err', error)
    })
    .finally(() => {
      this.setState({
        loading: false
      });
    })
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
        <View style={{height: 30, width: width, marginBottom: height / 10}}></View>
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
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.editProfile()}>
          <View style={styles.editWalletButton}>
            <Text
              underlayColor={'transparent'}
              style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
            >Save</Text>
          </View>
        </TouchableHighlight>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView extraHeight={100} style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {this.renderErrorMessage()}
        <View style={{flex: 2, width: width, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 15}}>
          <Avatar
            large
            rounded
            source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
        </View>
          <View style={styles.formContainer}>
            <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({name: text})} autoCapitalize={"none"} placeholderTextColor="grey" autoCorrect={false} placeholder="Name"/>
            <TextInput style={styles.textInputField} onChangeText={(text) => this.setState({bio: text})} autoCapitalize={"none"} placeholderTextColor="grey" placeholder="Bio" />
            {this.renderConnectButton()}
          </View>
        <View style={styles.actionOptionsContainer}>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => this.logout()}>
            <View style={styles.openExistingWalletButton}>
              <Text
                underlayColor={'transparent'}
                style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
              >Log out</Text>
            </View>
          </TouchableHighlight>
        </View>
        </KeyboardAwareScrollView>
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
    // paddingTop: height / 10,
    // paddingBottom: height / 10
  },
  shockWalletLogoContainer: {
    flex: 1,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionOptionsContainer: {
    flex: 1,
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
  createNewWalletButton: {
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
  formContainer: {
    flex: 2,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editWalletButton: {
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
  shockWalletCallToActionContainer: {
    flex: 1,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
