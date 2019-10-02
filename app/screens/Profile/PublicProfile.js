'use strict';

import React, { Component } from 'react';
import { Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import { StackActions } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { Avatar } from 'react-native-elements';
const storage = require('../../services/localStorage');

// import config from '../../dev.config';

const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');


export default class PublicProfile extends Component {
  // static navigationOptions = {
  //   header: null,
  // };

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      errorMessage: '',
      loading: false,
      host: '',
      accessToken: '',
      // nodePubKey: '02c40936a4d6e6546e143e24be12f62cdd65346fbc9f376a12eaa78b2938dee272',
      nodePubKey: this.props.navigation.state.params.nodePubKey,
      name: this.props.navigation.state.params.name,
      bio: this.props.navigation.state.params.bio
    }
    this.socket;
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
        this.socket = require('../../factories/ws/ws')(this.state.host);
      });
    });
  }

  sendCoin() {
    this.socket.emit("requestInvoice", {
      value: 123,
      memo: 'this is a memo',
      recipient: this.state.nodePubKey,
    });
  }

  renderErrorMessage() {
    if (this.state.errorMessage) {
      return (
        <TouchableHighlight underlayColor={'transparent'} onPress={() => this.setState({errorMessage: ''})}>
          <View style={{height: 30, width: width, backgroundColor: '#f2604d', marginBottom: height / 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#2E4674', fontWeight: 'bold'}}>{this.state.errorMessage}</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={{backgroundColor: '#2E4674', height: (height / 3), width: width, justifyContent: 'center', alignItems: 'center'}}>

        </View>
        <View style={{flex: 2, width: width, marginTop: -40, justifyContent: 'center', alignItems: 'center'}}>
          <Avatar
            large
            rounded
            source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
        </View>
        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around', alignItems: 'center', marginTop: 15}}>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => this.sendCoin()}>
            <View style={styles.editWalletButton}>
              <Text
                underlayColor={'transparent'}
                style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
              >Send</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => this.sendCoin()}>
            <View style={styles.sendCoinButton}>
              <Text
                underlayColor={'transparent'}
                style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
              >Request</Text>
            </View>
          </TouchableHighlight>
        </View>
        </ScrollView>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    width: width / 2.5,
    borderWidth: 0.5,
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  sendCoinButton: {
    height: 50,
    width: width / 2.5,
    borderWidth: 0.5,
    backgroundColor: '#3B7BD4',
    borderColor: '#3B7BD4',
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
