import { AppRegistry } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import moment from 'moment';

import LoginScreen from './app/screens/Login/Login';
import ConnectToHost from './app/screens/Login/connectToHost';
import ConnectToWallet from './app/screens/Login/connectToWallet';
import NewWallet from './app/screens/Login/newWallet';
import ConfirmPhrase from './app/screens/Login/confirmPhrase';
import FundWallet from './app/screens/Login/fundWallet';
import SearchForUsers from './app/screens/Search/Search';
import EditProfile from './app/screens/Profile/EditProfile';
import PublicProfile from './app/screens/Profile/PublicProfile';
// import WalletScreen from './app/screens/Wallet/Wallet';
import React, { Component } from 'react';
import LoggedInScreenNavigator from './app/factories/MainDrawerNavigator';


// https://github.com/moment/moment/issues/2781#issuecomment-160739129
moment.locale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'seconds',
    ss: '%ss',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: 'a month',
    MM: '%dM',
    y: 'a year',
    yy: '%dY',
  },
})

AppRegistry.registerComponent('shockwallet', () => ShockWallet);


const RootStack = createStackNavigator(
  {
    ConnectToHost: ConnectToHost,
    ConfirmPhrase: ConfirmPhrase,
    ConnectToWallet: ConnectToWallet,
    EditProfile: EditProfile,
    PublicProfile: PublicProfile,
    FundWallet: FundWallet,
    Login: LoginScreen,
    LoggedInScreenNavigator: LoggedInScreenNavigator,
    NewWallet: NewWallet,
    SearchForUsers: SearchForUsers
  },
  {
    initialRouteName: 'Login',
  }
);

export default class ShockWallet extends Component<Props> {
  render() {
    return <RootStack />;
  }
}
