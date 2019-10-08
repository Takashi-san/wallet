/**
 * @format
 */
import { AppRegistry, AsyncStorage, View, StyleSheet } from 'react-native'
import moment from 'moment'
import Http from 'axios'

import once from 'lodash/once'
import debounce from 'lodash/debounce'

import React, { Component } from 'react'

import RootStack, { setup as rootStackSetup } from './app/factories/RootStack'

import Loading from './app/screens/Loading'
import Advanced from './app/screens/Advanced'

import * as NavigationService from './app/services/navigation'
import * as Cache from './app/services/cache'
import * as ContactApi from './app/services/contact-api'
import WithConnWarning from './app/components/WithConnWarning'
import ShockDialog from './app/components/ShockDialog'
import ConnectToNode from './app/screens/ConnectToNode'

const CONTACT_SOCKET_PORT = 9835

// https://github.com/moment/moment/issues/2781#issuecomment-160739129
moment.locale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'just now',
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

AppRegistry.registerComponent('shockwallet', () => ShockWallet)

/**
 * @typedef {object} State
 * @prop {string} err
 * @prop {boolean} fetchingCache
 * @prop {boolean} nodeIPSet
 * @prop {string|null} tryingIP
 */

/**
 * @augments React.Component<{}, State, never>
 */
export default class ShockWallet extends Component {
  /** @type {State} */
  state = {
    err: '',
    fetchingCache: true,
    nodeIPSet: false,
    tryingIP: null,
  }

  onNodeIPUnsub = () => {}

  /**
   * @private
   * @readonly
   * @param {string|null} ip
   * @returns {void}
   */
  onNodeIPChange = ip => {
    if (ip === null) {
      this.setState({
        nodeIPSet: false,
      })
    } else {
      this.setState({
        nodeIPSet: true,
      })
    }
  }

  async componentDidMount() {
    const nodeIP = await Cache.getNodeIP()

    if (typeof nodeIP === 'string') {
      this.setState({
        tryingIP: nodeIP,
      })
    }

    this.setState({
      fetchingCache: false,
    })
  }

  componentWillUnmount() {
    this.onNodeIPUnsub()
  }

  /**
   * @param {never} _
   * @param {State} prevState
   */
  componentDidUpdate(_, prevState) {
    const navigationContainerComponentRefExists = this.state.nodeIPSet

    if (navigationContainerComponentRefExists) {
      rootStackSetup()
    }

    const ipToTry = prevState.tryingIP === null && this.state.tryingIP !== null

    if (!ipToTry) {
      return
    }

    ContactApi.Socket.connect(
      `http://${this.state.tryingIP}:${CONTACT_SOCKET_PORT}`,
    )

    Promise.race([
      new Promise(res => {
        ContactApi.Events.onConnection(
          debounce(
            once(conn => {
              res(conn)
            }),
            300,
          ),
        )
      }),
      new Promise(res => {
        setTimeout(() => {
          res(false)
        }, 5000)
      }),
    ])
      .then(async conn => {
        if (conn) {
          await Cache.writeNodeIP(this.state.tryingIP)
          const storedAuthData = await Cache.getStoredAuthData()
          // Sets a base URL for all requests so we won't have to worry
          // concatenating it every time we want to make a request.
          Http.defaults.baseURL = this.state.tryingIP
            ? `${this.state.tryingIP}:${CONTACT_SOCKET_PORT}/api`
            : undefined

          if (
            storedAuthData !== null &&
            storedAuthData.nodeIP === this.state.tryingIP
          ) {
            console.warn(`storedAuthData: ${JSON.stringify(storedAuthData)}`)
            ContactApi.Events.initAuthData(storedAuthData.authData)

            // Adds a default Authorization header for all requests
            if (storedAuthData.authData) {
              Http.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${storedAuthData.authData.token}`
            }
          }

          ContactApi.Events.setupEvents()

          this.onNodeIPUnsub = Cache.onNodeIPChange(this.onNodeIPChange)

          this.setState({
            tryingIP: null,
          })
        } else {
          // avoid reconnection attempts, unsubscribe event listeners
          ContactApi.Socket.disconnect()

          this.setState({
            tryingIP: null,
            err: 'Could not connect',
          })
        }
      })
      .catch(e => {
        console.warn('error')
        // avoid reconnection attempts, unsubscribe event listeners
        ContactApi.Socket.disconnect()

        this.setState({
          tryingIP: null,
          err:
            typeof e === 'object' && e !== null
              ? `Could not connect: ${e.message}`
              : 'Could not connect (unknown error)',
        })
      })
  }

  /**
   * @private
   * @type {import('react-navigation').NavigationContainerProps['onNavigationStateChange']}
   * @returns {void}
   */
  onNavChange = (_, newState) => {
    this.getCurrentRouteName(newState)
  }

  /**
   * @private
   * @param {import('react-navigation').NavigationState|import('react-navigation').NavigationRoute} navStateOrNavRoute
   * @returns {void}
   */
  getCurrentRouteName = navStateOrNavRoute => {
    if (navStateOrNavRoute.hasOwnProperty('index')) {
      this.getCurrentRouteName(
        navStateOrNavRoute.routes[navStateOrNavRoute.index],
      )
    } else {
      const currentRoute =
        // @ts-ignore
        /** @type {string} */ (navStateOrNavRoute['routeName'])

      NavigationService.setCurrentRoute(currentRoute)
    }
  }

  /**
   * @private
   * @param {import('react-navigation').NavigationContainerComponent|null} ref
   * @returns {void}
   */
  onRef = ref => {
    NavigationService.setTopLevelNavigator(ref)
  }

  /**
   * @private
   */
  dismissDialog = () => {
    this.setState({
      err: '',
    })
  }

  /**
   * @private
   * @param {string} ip
   */
  onPressConnect = ip => {
    this.setState({
      tryingIP: ip,
    })
  }

  onPressUseShockCloud = () => {
    this.setState({
      tryingIP: '167.88.11.206',
    })
  }

  render() {
    if (this.state.nodeIPSet) {
      return (
        <WithConnWarning>
          <RootStack
            onNavigationStateChange={this.onNavChange}
            ref={this.onRef}
          />
        </WithConnWarning>
      )
    }

    if (this.state.fetchingCache || this.state.tryingIP) {
      return (
        <View style={styles.flex}>
          <Loading />

          <ShockDialog
            message={this.state.err}
            onRequestClose={this.dismissDialog}
            visible={!!this.state.err}
          />
        </View>
      )
    }

    if (this.state.tryingIP === null) {
      return (
        <View style={styles.flex}>
          <ConnectToNode
            disableControls={!!this.state.tryingIP}
            onPressConnect={this.onPressConnect}
            onPressUseShockcloud={this.onPressUseShockCloud}
          />

          <ShockDialog
            message={this.state.err}
            onRequestClose={this.dismissDialog}
            visible={!!this.state.err}
          />
        </View>
      )
    }

    return <Loading />
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
})
