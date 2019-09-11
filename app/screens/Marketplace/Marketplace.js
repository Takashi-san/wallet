'use strict';

import React, { Component } from 'react';
import { Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, WebView, TouchableWithoutFeedback, View, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { withNavigation } from 'react-navigation'

// import { Button, Icon } from 'react-native-elements';
// import { StackNavigator } from 'react-navigation';
// import { NavigationActions } from 'react-navigation';
// import config from '../../dev.config';

// const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');



type Props = {};
let renderLeftHeader = () => (
  withNavigation(({ navigation }) => (
    <TouchableHighlight underlayColor={'transparent'} onPress={() => {
      navigation.toggleDrawer()
    }}>
      <View style={{marginLeft: 15}}>
        <EntypoIcons size={22} reverseColor={'white'} color={'white'} name='menu'/>
      </View>
    </TouchableHighlight>
  ))
)
let renderRightHeader = (callback) => {
  return (
    <TouchableHighlight underlayColor={'transparent'} onPress={callback}>
      <View style={{marginRight: 15}}>
        <EntypoIcons size={22} reverseColor={'white'} color={'white'} name='bell'/>
      </View>
    </TouchableHighlight>
  );
};

export default class MarketplaceScreen extends Component<Props> {
  static navigationOptions = (state) => {
    let params = state.navigation.state.params || {};
    return {
      headerStyle: {
        backgroundColor: '#315393',
      },
      title: 'LApp Market',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 22
      },
      headerLeft: params.headerLeft ? params.headerLeft : renderLeftHeader(() => {console.log('dog')}),
      headerRight: params.headerRight ? params.headerRight : renderRightHeader(() => {console.log('cat')}),
      openOptionsModal: false,
      tabBarIcon: ({tintColor}) => {
        return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='shop'/>)
      }
    };
  };
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerLeft: renderLeftHeader(() => {console.log('rendering left header')}),
      headerRight: renderRightHeader(() => {console.log('rendering right header')}),
    });
  }

  render() {
    return (
        <WebView source={{ uri: "http://yalls.org" }} />
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: height / 10,
  }
})
