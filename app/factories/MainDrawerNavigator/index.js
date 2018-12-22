import { createDrawerNavigator } from 'react-navigation'

import Channels from '../../screens/Channels'
import NodeControls from '../../screens/NodeControls'
import Home, { HOME_ROUTE_KEY } from '../TabNavigator/TabNavigator'


export const CHANNELS_ROUTE_KEY = 'CHANNELS_ROUTE_KEY'
export const NODE_CONTROLS_ROUTE_KEY = 'NODE_CONTROLS_ROUTE_KEY'


const MainDrawerNavigator = createDrawerNavigator({
  [CHANNELS_ROUTE_KEY]: Channels,
  [HOME_ROUTE_KEY]: Home,
  [NODE_CONTROLS_ROUTE_KEY]: NodeControls,
}, {
  initialRouteName: HOME_ROUTE_KEY
})

MainDrawerNavigator.navigationOptions = {
  header: null,
}


export default MainDrawerNavigator
