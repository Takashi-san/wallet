'use strict';

import React, { Component } from 'react';
import { Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import { StackActions } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { Avatar, Icon } from 'react-native-elements';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const storage = require('../../services/localStorage');

// import config from '../../dev.config';

const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');

let renderLeftHeader = (callback) => {
  return (
    <TouchableHighlight underlayColor={'transparent'} onPress={callback}>
      <View style={{marginLeft: 15}}>
        <EntypoIcons size={22} reverseColor={'white'} color={'white'} name='menu'/>
      </View>
    </TouchableHighlight>
  );
};
let renderRightHeader = (callback) => {
  return (
    <TouchableHighlight underlayColor={'transparent'} onPress={callback}>
      <View style={{marginRight: 15}}>
        <MaterialIcons size={22} reverseColor={'white'} color={'white'} name='settings'/>
      </View>
    </TouchableHighlight>
  );
};

export default class ProfileScreen extends Component {
  static navigationOptions = (state) => {
    let params = state.navigation.state.params || {};
    return {
      headerStyle: {
        backgroundColor: '#315393',
      },
      title: 'Profile',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white'
      },
      headerLeft: params.headerLeft ? params.headerLeft : renderLeftHeader(() => {console.log('dog')}),
      headerRight: params.headerRight ? params.headerRight : renderRightHeader(() => {console.log('cat')}),
      openOptionsModal: false,
      tabBarIcon: ({tintColor}) => {
        return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='user'/>)
      }
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      loading: false,
      name: '',
      bio: '',
      accessToken: ''
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerLeft: renderLeftHeader(() => {console.log('rendering left header')}),
      headerRight: renderRightHeader(() => this.props.navigation.push('EditProfile')),
    });
    let keys = [
      'name',
      'bio',
      'accessToken',
      'host'
    ];
    storage.multiGet(keys, (err, tokens) => {
      if (tokens) {
        this.setState({
          name: tokens[0] ? tokens[0][1] : 'No name',
          bio: tokens[1] ? tokens[1][1] : 'No bio',
          accessToken: tokens[2] ? tokens[2][1] : '',
          host: tokens[3] ? tokens[3][1] : '',
        }, () => {
          console.log('Done mounting');
        });
      }
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

  // <TouchableHighlight underlayColor={'transparent'} onPress={() => this.props.navigation.push('EditProfile')}>
  //   <View style={styles.editWalletButton}>
  //     <Text
  //       underlayColor={'transparent'}
  //       style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
  //     >Edit Profile</Text>
  //   </View>
  // </TouchableHighlight>
  //
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {this.renderErrorMessage()}
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15}}>

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
