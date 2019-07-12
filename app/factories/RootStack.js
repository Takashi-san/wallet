/**
 * @prettier
 */
import { createStackNavigator } from 'react-navigation'

import LoggedInScreenNavigator from './MainDrawerNavigator'

import Chat from '../screens/Chat'
import LoginScreen from '../screens/Login/Login'
import ConnectToHost from '../screens/Login/connectToHost'
import ConnectToWallet from '../screens/Login/connectToWallet'
import NewWallet from '../screens/Login/newWallet'
import ConfirmPhrase from '../screens/Login/confirmPhrase'
import FundWallet from '../screens/Login/fundWallet'
import SearchForUsers from '../screens/Search/Search'
import EditProfile from '../screens/Profile/EditProfile'
import PublicProfile from '../screens/Profile/PublicProfile'

export const CHAT_KEY = 'CHAT_KEY'

export default createStackNavigator(
  {
    [CHAT_KEY]: Chat,
    ConnectToHost: ConnectToHost,
    ConfirmPhrase: ConfirmPhrase,
    ConnectToWallet: ConnectToWallet,
    EditProfile: EditProfile,
    PublicProfile: PublicProfile,
    FundWallet: FundWallet,
    Login: LoginScreen,
    LoggedInScreenNavigator: LoggedInScreenNavigator,
    NewWallet: NewWallet,
    SearchForUsers: SearchForUsers,
  },
  {
    initialRouteName: 'Login',
  },
)
