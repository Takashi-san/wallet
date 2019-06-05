import { AppRegistry } from 'react-native';
import moment from 'moment';

import React, { Component } from 'react';
import RootStack from './app/factories/RootStack'


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

AppRegistry.registerComponent('shockwallet', () => ShockWallet);



export default class ShockWallet extends Component<Props> {
  render() {
    return <RootStack />;
  }
}
