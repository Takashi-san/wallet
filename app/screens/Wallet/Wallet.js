'use strict';

import React, { Component } from 'react';
import { Button, Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View, FlatList, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import io from 'socket.io-client';
import { Icon } from 'react-native-elements';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { StackActions } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

const uuidv4 = require('uuid/v4');
const btcConvert = require('../../services/convertBitcoin');
const moment = require('moment');
const errorReporter = require('../../services/errorReporter');

// const AsyncStorage = require('react-native').AsyncStorage;
const { width, height } = Dimensions.get('window');
const storage = require('../../services/localStorage');




type Props = {};
let renderLeftHeader = (callback) => {
  return (
    <TouchableHighlight underlayColor={'transparent'} onPress={callback}>
      <View style={{marginLeft: 15}}>
        <EntypoIcons size={22} reverseColor={'white'} color={'white'} name='menu'/>
      </View>
    </TouchableHighlight>
  );
}
let renderRightHeader = (callback) => {
  return (
    <TouchableHighlight underlayColor={'transparent'} onPress={callback}>
      <View style={{marginRight: 15}}>
        <EntypoIcons size={22} reverseColor={'white'} color={'white'} name='bell'/>
      </View>
    </TouchableHighlight>
  );
}

export default class WalletScreen extends Component<Props> {
  static navigationOptions = (state) => {
    let params = state.navigation.state.params || {};
    return {
      headerStyle: {
        backgroundColor: '#315393',
      },
      title: 'ShockWallet',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 22
      },
      headerLeft: params.headerLeft ? params.headerLeft : renderLeftHeader(() => {console.log('dog')}),
      headerRight: params.headerRight ? params.headerRight : renderRightHeader(() => {console.log('cat')}),
      openOptionsModal: false,
      tabBarIcon: ({tintColor}) => {
        return (<EntypoIcons size={22} reverseColor={'#CED0CE'} color={tintColor} name='wallet'/>)
      }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      host: '',
      accessToken: '',
      balanceInBitcoin: '',
      balanceInDollars: '',
      balance: null,
      USDExchangeRate: null,
      USDExchangeRateFloat: null,





      newAddress: 'NO DATA YET',
      newAddressIsLoading: '',

      networkInfo: 'NO DATA YET',
      networkInfoIsLoading: false,

      info: 'NO DATA YET',
      infoIsLoading: false,

      connectToPeerResponse: 'NO DATA YET',
      connectingToPeerIsLoading: false,

      listPeers: 'NO DATA YET',
      listPeersIsLoading: false,

      nodeInfo: 'NO DATA YET',
      nodeInfoIsLoading: false,

      channels: [],
      channelsIsLoading: false,

      pendingChannels: 'NO DATA YET',
      pendingChannelsIsLoading: false,

      listPayments: [{"payment_hash":"e84a8247093f8a4ea846f83db6517fd4848068e605cfe452123deca619a39e75","value":"200","creation_date":"1545247220","path":["025d1b5501d2880194bdada8c66bae08ba7bbd42e8bc7178efa8dfbf86b9df34c6"],"fee":"0","payment_preimage":"bda5dd39efefcea955cc614cc73abc07fa1f0611cbcc1e8fab042b0e3a15e452"},{"payment_hash":"c5756be70ae5b0a19aa6d3340d40cac6bcad15f6b474e9f0ab3c0e33e53eb2a2","value":"300","creation_date":"1545247250","path":["025d1b5501d2880194bdada8c66bae08ba7bbd42e8bc7178efa8dfbf86b9df34c6"],"fee":"0","payment_preimage":"d5e6d3d443045aa24426648175b1106db349606f754639da799de230f70963af"}],
      listPaymentsIsLoading: false,

      listInvoices: 'NO DATA YET',
      listInvoicesIsLoading: false,

      forwardingHistory: 'NO DATA YET',
      forwardingHistoryIsLoading: false,

      walletBalance: '',
      walletBalanceIsLoading: false,

      channelBalance: '',
      channelBalanceIsLoading: false,

    }
    this.socket;
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerLeft: renderLeftHeader(() => {console.log('rendering left header')}),
      headerRight: renderRightHeader(() => {console.log('rendering right header')}),
    });

    let keys = [
      'host',
      'authorization'
    ];
    storage.multiGet(keys, (err, tokens) => {
      this.setState({
        host: tokens[0][1],
        accessToken: tokens[1][1],
      }, () => {
        this.connectToPeer();

        setTimeout(() => {
          this.openChannel();
        }, 5000);

        this.listPayments();

        Promise.all([this.channelBalance(), this.walletBalance(), this.listChannels()])
        .then(() => {
          this.setBalance();
        });

        this.socket = require('../../factories/ws/ws')(this.state.host);
        // this.socket = io('http://localhost:3294');
        // this.socket.on('connect', () => {
        //   console.log('connect', this.socket);
        // });
        // this.socket.on('event', (data) => {
        //   console.log('event', data);
        // });
        // this.socket.on('invoice', (data) => {
        //   console.log('invoice received', data);
        // });
        // this.socket.on('disconnect', () => {
        //   console.log('disconnect');
        // });

      });
    });

    // this.getNetworkInfo();
    // this.getInfo();
    // this.listPeers();
    // this.listChannels();
    // this.listPendingChannels();
    // this.listInvoices();
    // this.forwardingHistory();
    // this.channelBalance();
    // this.walletBalance();
    // this.channelBalance();
  }



  getNewAddress() {
    let endpoint = `${this.state.host}/api/lnd/newaddress`;
    const payload = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      },
      body: JSON.stringify({
        'type': ["NESTED_PUBKEY_HASH", "WITNESS_PUBKEY_HASH"][Math.floor(Math.random() * 2)]
      })
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        newAddress: res.address
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        newAddressIsLoading: false,
      });
    })
  }

  renderNewAddress() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="Get New Address"
        onPress={() => this.getNewAddress()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.newAddress}</Text>
      </View>
    )
  }





  getNetworkInfo() {
    let endpoint = `${this.state.host}/api/lnd/getnetworkinfo`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        networkInfo: JSON.stringify(res)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        networkInfoIsLoading: false,
      });
    })
  }

  renderNetworkInfo() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="Get Network Info"
        onPress={() => this.getNetworkInfo()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.networkInfo}</Text>
      </View>
    )
  }




































  getInfo() {
    let endpoint = `${this.state.host}/api/lnd/getinfo`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        info: JSON.stringify(res)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        infoIsLoading: false,
      });
    })
  }

  renderInfo() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="Get Info"
        onPress={() => this.getInfo()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.info}</Text>
      </View>
    )
  }





  listPeers() {
    let endpoint = `${this.state.host}/api/lnd/listpeers`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        listPeers: JSON.stringify(res)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        listPeersIsLoading: false,
      });
    })
  }

  renderListPeers() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="List Peers"
        onPress={() => this.listPeers()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.listPeers}</Text>
      </View>
    )
  }



  processChannels (channels) {
    channels.forEach(function (channel) {
      channel.capacity = parseInt(channel.capacity);
      channel.local_balance = parseInt(channel.local_balance);
      channel.remote_balance = parseInt(channel.remote_balance);
      channel.total_satoshis_sent = parseInt(channel.total_satoshis_sent);
      channel.total_satoshis_received = parseInt(channel.total_satoshis_received);
      channel.num_updates = parseInt(channel.num_updates);
    });
    return channels;
  };

  listChannels() {
    let endpoint = `${this.state.host}/api/lnd/listchannels`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    return fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        channels: this.processChannels(res.channels)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        channelsIsLoading: false,
      });
    })
  }

  renderChannels() {
    return this.state.channels.map(channel => {
      return (<View>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>active: {channel.active}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>remote_pubkey: {channel.remote_pubkey}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>channel_point: {channel.channel_point}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>chan_id: {channel.chan_id}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>capacity: {channel.capacity}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>local_balance: {channel.local_balance}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>remote_balance: {channel.remote_balance}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>commit_fee: {channel.commit_fee}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>commit_weight: {channel.commit_weight}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>fee_per_kw: {channel.fee_per_kw}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>unsettled_balance: {channel.unsettled_balance}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>total_satoshis_sent: {channel.total_satoshis_sent}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>total_satoshis_received: {channel.total_satoshis_received}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>num_updates: {channel.num_updates}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>pending_htlcs: {channel.pending_htlcs}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>csv_delay: {channel.csv_delay}</Text>
        <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>private: {channel.private}</Text>
      </View>)
    })

  }

  renderListChannels() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="List Channels"
        onPress={() => this.listChannels()}
        />
      {this.renderChannels()}
      </View>
    )
  }



  listPendingChannels() {
    let endpoint = `${this.state.host}/api/lnd/pendingchannels`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        pendingChannels: JSON.stringify(res)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        pendingChannelsIsLoading: false,
      });
    })
  }

  renderPendingChannels() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="List Pending Channels"
        onPress={() => this.listPendingChannels()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.pendingChannels}</Text>
      </View>
    )
  }



  listPayments() {
    let endpoint = `${this.state.host}/api/lnd/listpayments`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        listPayments: res.payments
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        listPaymentsIsLoading: false,
      });
    })
  }

/*{"payments":
[{"payment_hash":"e84a8247093f8a4ea846f83db6517fd4848068e605cfe452123deca619a39e75","value":"200","creation_date":"1545247220",
"path":["025d1b5501d2880194bdada8c66bae08ba7bbd42e8bc7178efa8dfbf86b9df34c6"],"fee":"0",
"payment_preimage":"bda5dd39efefcea955cc614cc73abc07fa1f0611cbcc1e8fab042b0e3a15e452"},
{"payment_hash":"c5756be70ae5b0a19aa6d3340d40cac6bcad15f6b474e9f0ab3c0e33e53eb2a2","value":"300","creation_date":"1545247250",
"path":["025d1b5501d2880194bdada8c66bae08ba7bbd42e8bc7178efa8dfbf86b9df34c6"],"fee":"0",
"payment_preimage":"d5e6d3d443045aa24426648175b1106db349606f754639da799de230f70963af"}]}

*/

/* "memo": "",
"receipt": null,
"r_preimage": "Nx9ibriwOQbHkRgvvJCxQou8vMxE9giv7W825jkMToQ=",
"r_hash": "5fupbRG+9XzYAP0gp0v8Aq+zQLQbuX1TJcYWYcjN46w=",
"value": "500",
"settled": true,
"creation_date": "1544205169",
"settle_date": "1544205194",
"payment_request": "lntb5u1pwq4vm3pp5uha6jmg3hm6hekqql5s2wjluq2hmxs95rwuh65e9cctxrjxduwkqdqqcqzystt3phww9dlju8lcupvk00cj6ppfd3s4s3n6jcfrc86z7zfclk2jxqr9sd9ey40zldlgyty3a5j9sh66s3ql7vta6q0c49kjpdgfetvspujlevd",
"description_hash": null,
"expiry": "3600",
"fallback_addr": "",
"cltv_expiry": "144",
"route_hints": [
],
"private": false,
"add_index": "3",
"settle_index": "1",
"amt_paid": "500000",
"amt_paid_sat": "500",
"amt_paid_msat": "500000"
}
], */
  renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  renderPayment(payment) {
    let users = [
      "https://ask.libreoffice.org/m/default/media/images/nophoto.png",
    ];
    return (
      <View style={{flex: 1, flexDirection: 'row', width: width, marginTop: 10, marginBottom: 10}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Avatar
            small
            rounded
            source={{uri: "https://ask.libreoffice.org/m/default/media/images/nophoto.png"}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
        </View>
        <View style={{flex: 0, flexGrow: 1, justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>{payment.item.payment_hash.substring(0,8)}</Text>
          <Text>{btcConvert(payment.item.value, 'Satoshi', 'bit')} Bits</Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{marginRight: width / 10, marginLeft: width / 10, fontSize: 14}}>{moment.unix(payment.item.creation_date).fromNow()}</Text>
        </View>
        </View>
    )
  }

  renderPayments() {
    if (this.state.listPayments.length > 0) {
      return (<FlatList
        data={this.state.listPayments}
         ItemSeparatorComponent={this.renderSeparator}
         keyExtractor={(payments) => payments.payment_hash}
         renderItem={(item) => this.renderPayment(item)}
       />)
    } else {
      return null;
    }
  }



  listInvoices() {
    let endpoint = `${this.state.host}/api/lnd/listinvoices`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        listInvoices: JSON.stringify(res)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        listInvoicesIsLoading: false,
      });
    })
  }

  renderInvoices() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="List Invoices"
        onPress={() => this.listInvoices()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.listInvoices}</Text>
      </View>
    )
  }



  forwardingHistory() {
    let endpoint = `${this.state.host}/api/lnd/forwardinghistory`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        forwardingHistory: JSON.stringify(res)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        forwardingHistoryIsLoading: false,
      });
    })
  }

  renderForwardingHistory() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="Get Forwarding History"
        onPress={() => this.forwardingHistory()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.forwardingHistory}</Text>
      </View>
    )
  }



  walletBalance() {
    let endpoint = `${this.state.host}/api/lnd/walletbalance`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    return fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        walletBalance: res
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        walletBalanceIsLoading: false,
      });
    })
  }

  renderWalletBalance() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="Get Wallet Balance"
        onPress={() => this.walletBalance()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.walletBalance.confirmed_balance}</Text>
      </View>
    )
  }




  channelBalance() {
    let endpoint = `${this.state.host}/api/lnd/channelbalance`;
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      }
    };
    return fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        channelBalance: res
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        channelBalanceIsLoading: false,
      });
    })
  }

  renderChannelBalance() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="Get Channel Balance"
        onPress={() => this.channelBalance()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.channelBalance}</Text>
      </View>
    )
  }





  connectToPeer() {
    let endpoint = `${this.state.host}/api/lnd/connectpeer`;
    const payload = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      },
      body: JSON.stringify({
        // "pubkey": "02e58bc9d906cdd1853a6ef91dd6d8343c41e0be2f1ac2fa8f1517c24bff410cc7",
        // "host": "108.183.183.124:9735"
        // "pubkey": "031fef6e0039c188b5143b938ffa68eaa2985edb237aafbb8485cc57900bda558a",
        // "host": "85.11.37.130:9735"
        // "pubkey": "02311adba6fa14d7ace86d95b24fbdcaf5d99c0e8a12e49c66a857b7859bb213a5",
        // "host": "24.80.50.131:9735"
        "pubkey": "02212d3ec887188b284dbb7b2e6eb40629a6e14fb049673f22d2a0aa05f902090e",
        "host": "testnet-lnd.yalls.org"
      })
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        connectToPeerResponse: JSON.stringify(res)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        connectingToPeerIsLoading: false,
      });
    })
  }

  renderConnectToPeer() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
          color="orange"
          style
        title="Connect To Peer"
        onPress={() => this.connectToPeer()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.connectToPeerResponse}</Text>
      </View>
    )
  }




  getNodeInfo() {
    let endpoint = `${this.state.host}/api/lnd/getnodeinfo`;
    const payload = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.accessToken
      },
      body: JSON.stringify({
        "pubkey": "02e58bc9d906cdd1853a6ef91dd6d8343c41e0be2f1ac2fa8f1517c24bff410cc7"
      })
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      this.setState({
        nodeInfo: JSON.stringify(res)
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      this.setState({
        nodeInfoIsLoading: false,
      });
    })
  }

  renderNodeInfo() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
        color="orange"
        title="Get Node Info"
        onPress={() => this.getNodeInfo()}
        />
      <Text style={{marginRight: width / 10, marginLeft: width / 10, color: 'white', fontSize: 14}}>{this.state.nodeInfo}</Text>
      </View>
    )
  }

  openChannel() {
    let data = {
      rid: uuidv4(),
      // pubkey: "02e58bc9d906cdd1853a6ef91dd6d8343c41e0be2f1ac2fa8f1517c24bff410cc7",
      // pubkey: "031fef6e0039c188b5143b938ffa68eaa2985edb237aafbb8485cc57900bda558a",
      pubkey: "02212d3ec887188b284dbb7b2e6eb40629a6e14fb049673f22d2a0aa05f902090e",
      localamt: '500000',
      pushamt: '',
      // satperbyte: '',
      // targetconf: '',
      // remotecsvdelay: '',
      // privatechan: ''
    };
    this.socket.emit('openchannel', data, function (response) {
      if (response.error) {
        console.log('response.error', response.error)
        // deferred.reject(response.error);
      } else {
        console.log('response', response)
        // deferred.resolve(response);
      }
    });

  }

  renderOpenChannel() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
        color="orange"
        title="Open Channel"
        onPress={() => this.openChannel()}
        />
      </View>
    )
  }





  closeChannel() {
    let firstChannel = this.state.channels[0];
    var channelPoint = firstChannel.channel_point.split(":");

    let data = {
      rid: uuidv4(),
      funding_txid: channelPoint[0],
      output_index: channelPoint[1],
      force: true
    };
    this.socket.emit('closechannel', data, (response) => {
      if (response.error) {
        console.log('response.error', response.error)
      } else {
        console.log('response', response)
      }
    });

  }

  renderCloseChannel() {
    return (
      <View style={{flex: 1, justifyContent: 'center', width: width, alignItems: 'center', marginBottom: 50}}>
        <Button
        color="orange"
        title="Close Channel"
        onPress={() => this.closeChannel()}
        />
      </View>
    )
  }



























  setBalance() {
    let endpoint = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    const payload = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };
    fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then(res => {
      let localAmountInChannels = 0;
      this.state.channels.map(channel => {
        localAmountInChannels += parseInt(channel.local_balance)
      });
      let totalBalance = localAmountInChannels + this.state.walletBalance.confirmed_balance;
      this.setState({
        balance: totalBalance,
        USDExchangeRate: res.bpi.USD.rate,
        USDExchangeRateFloat: res.bpi.USD.rate_float,
      }, () => {
        this.setState({
          balanceInBitcoin: this.calculateBalanceInBitcoin(),
          balanceInDollars: this.calculateBalanceInDollars()
        })
      });
    })
    .catch(err => {
      errorReporter(this.state.host, this.state.accessToken, err);
      console.log('err', err)
    })
    .finally(() => {
      return;
    })
  }

  calculateBalanceInBitcoin() {
    return btcConvert(this.state.balance, 'Satoshi', 'bit');
  }

  calculateBalanceInDollars() {
    let balanceInBTC = btcConvert(this.state.balance, 'Satoshi', 'BTC')
    return balanceInBTC * this.state.USDExchangeRateFloat;
  }

  sendCoin() {
    this.socket.emit("requestInvoice", {
      value: 123,
      memo: 'this is a memo',
      recipient: '02c40936a4d6e6546e143e24be12f62cdd65346fbc9f376a12eaa78b2938dee272',
    });
  }


  render() {
    // {this.renderWalletBalance()}
    // {this.renderConnectToPeer()}
    // {this.renderListPeers()}
    // {this.renderOpenChannel()}
    // {this.renderListChannels()}
    // {this.renderPendingChannels()}
    // {this.renderChannelBalance()}
    // {this.renderCloseChannel()}
    // {this.renderNewAddress()}
    // {this.renderNetworkInfo()}
    // {this.renderInfo()}
    // {this.renderPayments()}
    // {this.renderInvoices()}
    // {this.renderForwardingHistory()}
    // {this.renderNodeInfo()}
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={{height: height / 2, width: width, backgroundColor: '#2E4674'}}>
          <View style={{flex: 2, margin: 25, backgroundColor: '#56688D', borderColor: '#56688D', borderWidth: 0.5, borderRadius: 10,}}>

            <View style={{flex: 1, backgroundColor: '#56688D', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>BALANCE</Text>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{this.state.balanceInBitcoin} BITS</Text>
            </View>

            <View style={{flex: 1, backgroundColor: '#56688D', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>USD VALUE</Text>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>${(Math.round(this.state.balanceInDollars*100)/100).toFixed(2)}</Text>
            </View>

          </View>


          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: width, backgroundColor: '#2E4674'}}>
            <TouchableHighlight underlayColor={'transparent'} onPress={() => this.sendCoin()}>
              <View style={styles.sendButton}>
                <Text
                  underlayColor={'transparent'}
                  style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
                >Send</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={'transparent'} onPress={() => this.requestCoin()}>
              <View style={styles.requestButton}>
                <Text
                  underlayColor={'transparent'}
                  style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}
                >Request</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>


        <View style={{backgroundColor: 'white', height: height, flex: 1, width: width}}>
          {this.renderPayments()}
        </View>
        </ScrollView>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    // paddingBottom: height / 10
  },
  shockWalletLogoContainer: {
    flex: 1,
    backgroundColor: '#2E4674',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enabledSubmitBtn: {
    height: 25,
    width: width / 2,
    borderWidth: 0.5,
    backgroundColor: '#eba844',
    borderColor: '#eba844',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: 'white',
    fontWeight: 'bold'
  },
  sendButton: {
    height: 50,
    width: width / 2.5,
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
    borderWidth: .5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 20
  },
  requestButton: {
    height: 50,
    width: width / 2.5,
    borderWidth: .5,
    backgroundColor: '#3B7BD4',
    borderColor: '#3B7BD4',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginRight: 20
  }
})
