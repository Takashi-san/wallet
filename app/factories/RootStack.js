/**
 * @prettier
 */

import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation'
import debounce from 'lodash/debounce'
import once from 'lodash/once'

import LoggedInScreenNavigator from './MainDrawerNavigator'

import Chat, { CHAT_ROUTE } from '../screens/Chat'
import Chats, { CHATS_ROUTE } from '../screens/Chats'
import Advanced, { ADVANCED_SCREEN } from '../screens/Advanced'
import ConnectToHost from '../screens/Login/connectToHost'
import ConnectToWallet from '../screens/Login/connectToWallet'
import NewWallet from '../screens/Login/newWallet'
import ConfirmPhrase from '../screens/Login/confirmPhrase'
import FundWallet from '../screens/Login/fundWallet'
import SearchForUsers from '../screens/Search/Search'
import EditProfile from '../screens/Profile/EditProfile'
import PublicProfile from '../screens/Profile/PublicProfile'
import WalletOverview, { WALLET_OVERVIEW } from '../screens/WalletOverview'

import ChooseDisplayName, {
  CHOOSE_DISPLAY_NAME,
} from '../screens/ChooseDisplayName'
import Login, { LOGIN } from '../screens/Login'
import Register, { REGISTER } from '../screens/Register'
import User from '../screens/TheirProfile'
import Users from '../screens/Users'

import MyProfile, { MY_PROFILE } from '../screens/MyProfile'
import Loading, { LOADING } from '../screens/Loading'

import * as ContactAPI from '../services/contact-api'
import * as Cache from '../services/cache'
import * as NavigationService from '../services/navigation'

export const APP = 'APP'
export const MAIN_NAV = 'MAIN_NAV'

const MainNav = createBottomTabNavigator(
  {
    [WALLET_OVERVIEW]: WalletOverview,
    [CHATS_ROUTE]: Chats,
    [MY_PROFILE]: MyProfile,
  },
  {
    initialRouteName: WALLET_OVERVIEW,
    tabBarOptions: {
      showLabel: false,
    },
  },
)

MainNav.navigationOptions = {
  header: null,
}

const MAIN_DRAWER = 'MAIN_DRAWER'

const MainDrawer = createDrawerNavigator(
  {
    [MAIN_NAV]: MainNav,
    [ADVANCED_SCREEN]: Advanced,
  },
  {
    initialRouteName: MAIN_NAV,
  },
)

MainDrawer.navigationOptions = {
  header: null,
}

const App = createStackNavigator(
  {
    [ADVANCED_SCREEN]: Advanced,
    [CHAT_ROUTE]: Chat,
    ConnectToHost: ConnectToHost,
    ConfirmPhrase: ConfirmPhrase,
    ConnectToWallet: ConnectToWallet,
    EditProfile: EditProfile,
    PublicProfile: PublicProfile,
    FundWallet: FundWallet,
    LoggedInScreenNavigator: LoggedInScreenNavigator,
    NewWallet: NewWallet,
    SearchForUsers: SearchForUsers,
    User,
    Users,

    [MAIN_DRAWER]: MainDrawer,
  },
  {
    headerLayoutPreset: 'center',
    initialRouteName: MAIN_DRAWER,
  },
)

const AUTH = 'AUTH'

const Auth = createStackNavigator(
  {
    [LOGIN]: Login,
    [REGISTER]: Register,
  },
  {
    initialRouteName: LOGIN,
  },
)

const MainSwitch = createSwitchNavigator(
  {
    [AUTH]: Auth,
    [APP]: App,
    [LOADING]: Loading,
    [CHOOSE_DISPLAY_NAME]: ChooseDisplayName,
  },
  {
    initialRouteName: APP,
  },
)

export const setup = async () => {
  try {
    ContactAPI.Events.onAuth(
      debounce(ad => {
        const currentRoute = NavigationService.getCurrentRoute()
        // Anytime un-authentication happens immediately navigate to the login screen.

        if (ad === null && currentRoute !== AUTH) {
          NavigationService.navigate(AUTH)
        }

        if (ad !== null && currentRoute !== APP) {
          NavigationService.navigate(APP)
        }

        Cache.writeStoredAuthData(ad)
      }),
    )
  } catch (e) {
    console.warn(e)
  }
}

export default MainSwitch
