// import { TabNavigator } from "react-navigation";
import React, { Component } from 'react';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import WalletScreen from '../../screens/Wallet/Wallet';
import InboxScreen from '../../screens/Inbox/Inbox';
import SearchForUsersScreen from '../../screens/Search/Search';
import MarketplaceScreen from '../../screens/Marketplace/Marketplace';
import ProfileScreen from '../../screens/Profile/Profile';


import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation';

export const HOME_ROUTE_KEY = 'HOME_ROUTE_KEY'

const WalletStack = createStackNavigator(
  {
    WalletScreen: WalletScreen,
  },
  {
    initialRouteName: 'WalletScreen',
  }
);


const InboxStack = createStackNavigator(
  {
    InboxScreen: InboxScreen,
  },
  {
    initialRouteName: 'InboxScreen',
  }
);

const SearchStack = createStackNavigator(
  {
    InboxScreen: SearchForUsersScreen,
  },
  {
    initialRouteName: 'InboxScreen',
  }
);

const MarketplaceStack = createStackNavigator(
  {
    MarketplaceScreen: MarketplaceScreen,
  },
  {
    initialRouteName: 'MarketplaceScreen',
  }
);

const ProfileStack = createStackNavigator(
  {
    ProfileScreen: ProfileScreen,
  },
  {
    initialRouteName: 'ProfileScreen',
  }
);



const LoggedInScreenNavigator = createBottomTabNavigator({
    Wallet: {
      screen: WalletStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='wallet'/>)
        }
      }
    },
    // Inbox: {
    //   screen: InboxStack,
    //   navigationOptions: {
    //     tabBarIcon: ({tintColor}) => {
    //       return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='chat'/>)
    //     }
    //   }
    // },
    Inbox: {
      screen: SearchStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='chat'/>)
        }
      }
    },
    Market: {
      screen: MarketplaceStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='shop'/>)
        }
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='user'/>)
        }
      }
    },
    // Inbox: { screen: InboxScreen
    //   navigationOptions: ({ navigation }) => ({
    //     title: `Wallet`,
    //     headerStyle: {
    //       backgroundColor: '#315393',
    //     },
    //     header: {
    //       visible: false
    //     },
    //   }),
    // },
    // Market: {
    //   screen: MarketplaceScreen,
    //   navigationOptions: ({ navigation }) => ({
    //     title: `Wallet`,
    //     headerStyle: {
    //       backgroundColor: '#315393',
    //     },
    //     header: {
    //       visible: false
    //     },
    //   }),
    // },
    // Profile: {
    //   screen: ProfileScreen,
    //   navigationOptions: ({ navigation }) => ({
    //     title: `Wallet`,
    //     headerStyle: {
    //       backgroundColor: '#315393',
    //     },
    //     header: {
    //       visible: false
    //     },
    //   }),
    // },
  }, {
    tabBarOptions: {
      showLabel: false,
      header: null,
      activeTintColor: 'black',
      style: {
        backgroundColor: 'white',
      }
    },
    lazy: false
  });

LoggedInScreenNavigator.navigationOptions = {
  // Hide the header from AppNavigator stack
  header: null,
  title: 'Home'
};

export default LoggedInScreenNavigator

//
// const LoggedInScreenNavigator = TabNavigator({
//   Wallet: {
//     screen: WalletScreen,
//     navigationOptions: {
//       title: `Wallet`,
//       headerStyle: {
//         backgroundColor: '#315393',
//       },
//       header: {
//         visible: false
//       },
//     },
//   },
//   Inbox: {
//     screen: SearchForUsersScreen,
//     navigationOptions: ({ navigation }) => ({
//       title: `Wallet`,
//       headerStyle: {
//         backgroundColor: '#315393',
//       },
//       header: {
//         visible: false
//       },
//     }),
//   },
//   // Inbox: { screen: InboxScreen
//   //   navigationOptions: ({ navigation }) => ({
//   //     title: `Wallet`,
//   //     headerStyle: {
//   //       backgroundColor: '#315393',
//   //     },
//   //     header: {
//   //       visible: false
//   //     },
//   //   }),
//   // },
//   Market: {
//     screen: MarketplaceScreen,
//     navigationOptions: ({ navigation }) => ({
//       title: `Wallet`,
//       headerStyle: {
//         backgroundColor: '#315393',
//       },
//       header: {
//         visible: false
//       },
//     }),
//   },
//   Profile: {
//     screen: ProfileScreen,
//     navigationOptions: ({ navigation }) => ({
//       title: `Wallet`,
//       headerStyle: {
//         backgroundColor: '#315393',
//       },
//       header: {
//         visible: false
//       },
//     }),
//   },
// }, {
//   tabBarOptions: {
//     showLabel: false,
//     activeTintColor: 'black',
//     style: {
//       backgroundColor: 'white',
//     }
//   },
//   lazy: false
// });
//
// export default LoggedInScreenNavigator
