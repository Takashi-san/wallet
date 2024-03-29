import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Http from "axios";
import Big from "big.js";
import BasicDialog from "../../components/BasicDialog";
import ShockInput from "../../components/ShockInput";
import IGDialogBtn from "../../components/IGDialogBtn";
import Pad from "../../components/Pad";
import AccordionItem from "./Accordion";
import Transaction from "./Accordion/Transaction";
import Channel from "./Accordion/Channel";
import Invoice from "./Accordion/Invoice";
import Peer from "./Accordion/Peer";
import {balance, USDExchangeRate} from "../../services/wallet";

export const ADVANCED_SCREEN = "ADVANCED_SCREEN";
export default class AdvancedScreen extends Component {
  state = {
    accordions: {
      transactions: true,
      peers: false,
      invoices: false,
      channels: false
    },
    transactions: { 
      content: [], 
      page: 0, 
      totalPages: 0 
    },
    peers: [],
    invoices: { 
      content: [], 
      page: 0, 
      totalPages: 0 
    },
    channels: [],
    confirmedBalance: "0",
    unconfirmedBalance: "0",
    USDRate: null,
    addPeerOpen: false,
    addChannelOpen: false,
    peerPublicKey: "",
    host: "",
    channelPublicKey: ""
  };

  componentDidMount() {
    // this.props.navigation.setParams({
    //   headerLeft: renderLeftHeader(() => {console.log('rendering left header')}),
    //   headerRight: renderRightHeader(() => {console.log('rendering right header')}),
    // });
    this.getUserBalance();
    this.fetchData();
  }

  getUserBalance = async () => {
    try {
      const [walletBalance, USDRate] = await Promise.all([await balance(), USDExchangeRate()]);
      console.log(walletBalance, USDRate);
      this.setState({
        USDRate,
        confirmedBalance: walletBalance.confirmed_balance,
        unconfirmedBalance: walletBalance.unconfirmed_balance
      });
    } catch(err) {
      console.error(err);
    }
  }

  convertBTCToUSD = () => {
    const { confirmedBalance, unconfirmedBalance, USDRate } = this.state;
    if (USDRate !== null) {
      const parsedConfirmedBalance = new Big(confirmedBalance);
      const parsedUnconfirmedBalance = new Big(unconfirmedBalance);
      const parsedUSDRate = new Big(USDRate);
      const satoshiUnit = new Big(0.00000001);
      const confirmedBalanceUSD = parsedConfirmedBalance.times(satoshiUnit).times(parsedUSDRate).toFixed(2);
      const unconfirmedBalanceUSD = parsedUnconfirmedBalance.times(satoshiUnit).times(parsedUSDRate).toFixed(2);
      
      return {
        confirmedBalanceUSD,
        unconfirmedBalanceUSD
      };
    }

    return {
      confirmedBalanceUSD: 0,
      unconfirmedBalanceUSD: 0
    }
  }

  fetchData = async () => {
    try {
      const [invoices, payments, peers, channels] = await Promise.all([
        Http.get('/lnd/listinvoices?itemsPerPage=20&page=1'),
        Http.get('/lnd/listpayments?itemsPerPage=20&page=1'),
        Http.get('/lnd/listpeers'),
        Http.get('/lnd/listchannels')
      ]);
  
      console.log({
        invoices: invoices.data,
        payments: payments.data,
        peers: peers.data.peers,
        channels: channels.data.channels
      })
  
      this.setState({
        invoices: invoices.data,
        payments: payments.data,
        peers: peers.data.peers,
        channels: channels.data.channels
      })
    } catch (err) {
      console.error(err);
    }
  }

  toggleAccordion = name => {
    const { accordions } = this.state;
    const updatedAccordions = Object.keys(accordions).reduce((accordions, accordion) => {
      const newStatus = name === accordion;
      return {
        ...accordions,
        [accordion]: newStatus
      }
    }, {});
    this.setState({
      accordions: updatedAccordions
    })
  }

  wait = (ms) => new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });

  fetchNextPage = async (routeName = "", stateName = "") => {
    const currentData = this.state[stateName];
    await this.wait(2000)
    const { data } = await Http.get(`/lnd/list${routeName}?page=${currentData.page + 1}`);
    this.setState({
      [stateName]: {
        ...data,
        content: [...currentData.content, ...data.content]
      }
    });
  }

  handleInputChange = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  addPeer = async () => {
    try {
      const { peerPublicKey, host } = this.state;
      
      await Http.post(`/lnd/connectpeer`, {
        host,
        pubkey: peerPublicKey
      });
  
      const newPeers = await Http.get('/lnd/listpeers');

      console.log("newPeers", newPeers);
  
      this.setState({
        peers: newPeers.data.peers,
        host: "",
        peerPublicKey: ""
      });
    } catch (err) {
      console.error(Http.defaults.baseURL, err.response);
    }
  }

  addChannel = async () => {
    const { channelPublicKey } = this.state;
    
    await Http.post(`/lnd/openchannel`, {
      pubkey: channelPublicKey
    });

    const newChannels = await Http.get('/lnd/listchannels');

    this.setState({
      channels: newChannels.data.channels,
      channelPublicKey: ""
    });
  }

  render() {
    const { 
      accordions, 
      transactions, 
      peers,
      invoices,
      channels,
      addPeerOpen,
      addChannelOpen,
      peerPublicKey,
      channelPublicKey,
      host,
      balance,
      USDRate,
      confirmedBalance,
      unconfirmedBalance
    } = this.state;
    const { confirmedBalanceUSD, unconfirmedBalanceUSD } = this.convertBTCToUSD();
    return (
        <View style={styles.container}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={["#194B93", "#4285B9"]} style={styles.statsHeader}>
            <View style={styles.nav}>
              <View style={styles.navAvatarContainer}>
                <Image style={styles.navAvatar} />
                {/* <View style={styles.avatarNotifications}>
                  <Text style={styles.avatarNotificationsText}>2</Text>
                </View> */}
              </View>

              <Text style={styles.navText}>Channels</Text>
              <View style={styles.settingsBtn}>
                <EntypoIcons name="cog" size={30} color="white" />
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={[styles.stat, { marginBottom: 15 }]}>
                <View style={styles.statIcon}>
                  <EntypoIcons name="flash" color="#F5A623" size={20} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statTextPrimary}>{USDRate ? confirmedBalance.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : "Loading..."} sats</Text>
                  <Text style={styles.statTextSecondary}>{USDRate ? confirmedBalanceUSD.replace(/\d(?=(\d{3})+\.)/g, '$&,') : "Loading..."} USD</Text>
                </View>
              </View>
              <View style={styles.stat}>
                <View style={styles.statIcon}>
                  <EntypoIcons name="link" color="#F5A623" size={20} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statTextPrimary}>{USDRate ? unconfirmedBalance.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : "Loading..."} sats</Text>
                  <Text style={styles.statTextSecondary}>{USDRate ? unconfirmedBalanceUSD.replace(/\d(?=(\d{3})+\.)/g, '$&,') : "Loading..."} USD</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.accordionsContainer}>
            <AccordionItem 
              paginated={true}
              fetchNextPage={() => this.fetchNextPage("payments", "transactions")}
              data={transactions}
              Item={Transaction}
              title="Transactions" 
              open={accordions["transactions"]}
              menuOptions={[{
                name: "Generate",
                icon: "link"
              }, {
                name: "Send",
                icon: "flash"
              }]}
              toggleAccordion={() => this.toggleAccordion("transactions")}
            />
            <AccordionItem 
              data={peers}
              Item={Peer}
              title="Peers" 
              open={accordions["peers"]}
              menuOptions={[{
                name: "Add Peer",
                icon: "link",
                action: () => {
                  console.log("addPeerOpen");
                  this.setState({
                    addPeerOpen: true
                  })
                }
              }]}
              toggleAccordion={() => this.toggleAccordion("peers")}
            />
            <AccordionItem 
              paginated={true}
              fetchNextPage={() => this.fetchNextPage("invoices", "invoices")}
              data={invoices}
              Item={Invoice}
              title="Invoices" 
              open={accordions["invoices"]}
              toggleAccordion={() => this.toggleAccordion("invoices")}
            />
            <AccordionItem 
              data={channels}
              Item={Channel}
              title="Channels" open={accordions["channels"]}
              menuOptions={[{
                name: "Add Channel",
                icon: "link",
                action: () => {
                  this.setState({
                    addChannelOpen: true
                  })
                }
              }]}
              toggleAccordion={() => this.toggleAccordion("channels")}
            />
          </View>
          <BasicDialog
            onRequestClose={() => this.setState({
              addPeerOpen: false
            })}
            visible={addPeerOpen}
          >
            <View>
              <ShockInput
                placeholder="Public Key"
                onChangeText={text => this.handleInputChange("peerPublicKey", text)}
                value={peerPublicKey}
              />

              <Pad amount={10} />

              <ShockInput
                placeholder="Host"
                onChangeText={text => this.handleInputChange("host", text)}
                value={host}
              />

              <IGDialogBtn
                disabled={!host || !peerPublicKey}
                onPress={this.addPeer}
                title="Add Peer"
              />
            </View>
          </BasicDialog>
          <BasicDialog
            onRequestClose={() => this.setState({
              addChannelOpen: false
            })}
            visible={addChannelOpen}
          >
            <View>
              <ShockInput
                placeholder="Public Key"
                onChangeText={text => this.handleInputChange("channelPublicKey", text)}
                value={channelPublicKey}
              />

              <IGDialogBtn
                disabled={!channelPublicKey}
                onPress={this.addChannel}
                title="Add Channel"
              />
            </View>
          </BasicDialog>
        </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  statsHeader: {
    width: "100%",
    elevation: 1,
    zIndex: 10
  },
  nav: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25
  },
  navAvatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: '#0071BC'
  },
  avatarNotifications: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: "#F5A623",
    justifyContent: "center",
    alignItems: "center"
  },
  avatarNotificationsText: {
    color: "white",
    fontWeight: "900",
    fontSize: 17
  },
  navText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "white"
  },
  settingsBtn: {
    width: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  statsContainer: {
    paddingHorizontal: 30,
    marginBottom: 30
  },
  stat: {
    flexDirection: 'row',
  },
  statIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
    borderStyle: "solid"
  },
  statTextPrimary: {
    color: "white",
    fontSize: 25,
    fontWeight: "900"
  },
  statTextSecondary: {
    color: "#F5A623",
    fontSize: 14
  },
  accordionsContainer: {
    width: "100%",
    flex: 1
  }
})
