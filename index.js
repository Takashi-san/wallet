import { AppRegistry } from 'react-native';
// import App from './App';
import { createStackNavigator } from 'react-navigation';
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
