'use strict';

import React, { Component } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View, ScrollView, FlatList } from 'react-native';
import { StackActions } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { Avatar, SearchBar } from 'react-native-elements';
import { Icon } from 'react-native-elements'
import EntypoIcons from 'react-native-vector-icons/Entypo';

const storage = require('../../services/localStorage');
const errorReporter = require('../../services/errorReporter');

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
        <EntypoIcons size={22} reverseColor={'white'} color={'white'} name='bell'/>
      </View>
    </TouchableHighlight>
  );
};

export default class SearchForUsersScreen extends Component {
  static navigationOptions = (state) => {
    let params = state.navigation.state.params || {};
    return {
      headerStyle: {
        backgroundColor: '#315393',
      },
      title: 'Search',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 22
      },
      headerLeft: params.headerLeft ? params.headerLeft : renderLeftHeader(() => {console.log('dog')}),
      headerRight: params.headerRight ? params.headerRight : renderRightHeader(() => {console.log('cat')}),
      openOptionsModal: false,
      tabBarIcon: ({tintColor}) => {
        return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='chat'/>)
      }
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      errorMessage: '',
      loading: false,
      profiles: [],
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerLeft: renderLeftHeader(() => {console.log('rendering left header')}),
      headerRight: renderRightHeader(() => {console.log('rendering right header')}),
    });
    let keys = [
      'host',
      'authorization'
    ];
    storage.multiGet(keys, (err, tokens) => {
      this.setState({
        host: tokens[0][1],
        accessToken: tokens[1][1],
      }, () => {
        this.getProfiles();
      });
    });
  }

  getProfiles() {
    let endpoint = `${this.state.host}/api/static/profiles`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    this.setState({loading: true});
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200 || res.status == 400) {
        return res.json();
      }
    })
    .then(res => {
      console.log('res', res)
      if (res.errorMessage) {
        return;
      }
      let dummyUsers = [
        "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
        "https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg",
        "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg",
        "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
      ];
      let users = res.profiles.slice(-4);
      for (let i = 0; i < 4; i++) {
        res.profiles.slice(-4)
        users[i].avatar = dummyUsers[i];
      }
      this.setState({
        profiles: users || []
      });
      console.log('res', res);
    })
    .catch(err => {
      this.setState({
        errorMessage: 'Something strange happened. Try again'
      });
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
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
  renderSearchBar() {

    return (
      <SearchBar
        lightTheme
        onChangeText={() => console.log('sup')}
        onClear={() => console.log('sup')}
        placeholder='Type Here...' />
    );
  }

  renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  renderProfile(profile) {
    console.log('renderprofile item', profile)
    return (
      <TouchableHighlight onPress={
        () => {
          // this.props.navigation.push('PublicProfile', {fuck: 'y'}
          const navigateAction = NavigationActions.navigate({
            routeName: 'PublicProfile',

            params: {
              nodePubKey: profile.item.nodePubKey,
              name: profile.item.name,
              bio: profile.item.bio
            },

            action: NavigationActions.navigate({ routeName: 'PublicProfile' }),
          });

          this.props.navigation.dispatch(navigateAction);
        }
      }
      underlayColor={'transparent'}
      >
        <View style={{flex: 1, flexDirection: 'row', width: width, marginTop: 10, marginBottom: 10}}>
        <View style={{marginLeft: 15, width: width / 10, justifyContent: 'center', alignItems: 'center'}}>
          <Avatar
            small
            rounded
            source={{uri: profile.item.avatar}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
        </View>
        <View style={{flex: 0, flexGrow: 1, justifyContent: 'center', alignItems: 'flex-start', marginLeft: 15}}>
          <Text style={{fontWeight: 'bold'}}>{profile.item.name}</Text>
        </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderProfiles() {
    // if (this.state.profiles.length > 0) {
    if (this.state.profiles) {
      return (<FlatList
         style={{backgroundColor: 'white', height: height, flex: 1, width: width}}
         data={this.state.profiles}
         ItemSeparatorComponent={this.renderSeparator}
         keyExtractor={(profile) => profile._id}
         renderItem={(item) => this.renderProfile(item)}
       />)
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{width: width}}>
          {this.renderSearchBar()}
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {this.renderProfiles()}
        </ScrollView>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
