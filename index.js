import { AppRegistry, SafeAreaView, Text, ScrollView } from 'react-native';
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
import ShockButton from './app/components/ShockButton';
import UserDetail from './app/components/UserDetail';
import ListingDetail from './app/screens/ListingDetail';

import { Colors } from './app/css';

import Carousel from 'react-native-smart-carousel';


const data = [
  {
      id: 333,
      title: "Page 1",
      imagePath: 'https://cdn-images-1.medium.com/max/1200/1*C3kxjCrJy-aWSMpe2chfaA.png'
  },
  {
    id: 334,
    title: "Page 2",
    imagePath: "https://cdn-images-1.medium.com/max/1600/1*yWS1bEU6aoaXYHCUm2L2Rg.png"
  }
]


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

    return (
     <SafeAreaView style={{ flex: 1 }}>
       <ListingDetail />
     </SafeAreaView>
    )
  }
}
