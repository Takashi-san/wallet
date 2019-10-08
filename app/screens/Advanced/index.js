import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Http from "axios";
import HttpConfig from "../../services/axiosConfig";
import AccordionItem from "./Accordion";
import Transaction from "./Accordion/Transaction";
import Channel from "./Accordion/Channel";
import Invoice from "./Accordion/Invoice";

export const ADVANCED_SCREEN = "ADVANCED_SCREEN";
export default class AdvancedScreen extends Component {
  state = {
    accordions: {
      transactions: true,
      peers: false,
      invoices: false,
      channels: false
    },
    transactions: [],
    peers: [],
    invoices: [],
    channels: []
  };

  componentDidMount() {
    // this.props.navigation.setParams({
    //   headerLeft: renderLeftHeader(() => {console.log('rendering left header')}),
    //   headerRight: renderRightHeader(() => {console.log('rendering right header')}),
    // });
    this.fetchData();
  }

  fetchData = async () => {
    const [invoices, payments, peers, channels] = await Promise.all([
      Http.get('/lnd/listinvoices'),
      Http.get('/lnd/listpayments'),
      Http.get('/lnd/listpeers'),
      Http.get('/lnd/listchannels')
    ]);

    this.setState({
      invoices: invoices.data.entries,
      payments: payments.data.entries,
      peers: peers.data.peers,
      channels: channels.data.channels
    })
  }

  toggleAccordion = (name) => {
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

  render() {
    const { 
      accordions, 
      transactions, 
      peers,
      invoices,
      channels 
    } = this.state;
    return (
        <View style={styles.container}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={["#194B93", "#4285B9"]} style={styles.statsHeader}>
            <View style={styles.nav}>
              <View style={styles.navAvatarContainer}>
                <Image style={styles.navAvatar} />
                <View style={styles.avatarNotifications}>
                  <Text style={styles.avatarNotificationsText}>2</Text>
                </View>
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
                  <Text style={styles.statTextPrimary}>4,000 sats</Text>
                  <Text style={styles.statTextSecondary}>3,262 USD</Text>
                </View>
              </View>
              <View style={styles.stat}>
                <View style={styles.statIcon}>
                  <EntypoIcons name="link" color="#F5A623" size={20} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statTextPrimary}>4,000 sats</Text>
                  <Text style={styles.statTextSecondary}>3,262 USD</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.accordionsContainer}>
            <AccordionItem title="Transactions" open={accordions["transactions"]} toggleAccordion={() => this.toggleAccordion("transactions")}>
              {transactions.map(transaction =>
                <Transaction data={transaction} />
              )}
            </AccordionItem>
            <AccordionItem title="Peers" open={accordions["peers"]} toggleAccordion={() => this.toggleAccordion("peers")}>
              {peers.map(peer => <Transaction data={peer} />)}
            </AccordionItem>
            <AccordionItem title="Invoices" open={accordions["invoices"]} toggleAccordion={() => this.toggleAccordion("invoices")}>
              {invoices.map(invoice => <Invoice data={invoice} />)}
            </AccordionItem>
            <AccordionItem title="Channels" open={accordions["channels"]} toggleAccordion={() => this.toggleAccordion("channels")}>
              {channels.map(channel => <Channel data={channel} />)}
            </AccordionItem>
          </View>
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
