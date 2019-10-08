import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Moment from "moment";
import paymentIcon from "../../../assets/images/payment-icon.png"

export default class Transaction extends Component {
  state = {
    open: false
  };

  componentDidMount() {
    const { open } = this.props;
    this.setState({
      open
    });
  }

  render() {
    const { data } = this.props;
    return (
      <View style={styles.channelItem}>
        <View style={styles.channelDetails}>
          <Text style={styles.channelIp}>{data.address}</Text>
          <Text style={styles.channelName}>
            Bob.com <View style={styles.channelStatus}></View>
          </Text>
          <Text style={styles.channelPublicKey}>{data.address}</Text>
          <View style={styles.channelStats}>
            <View style={[styles.channelStat, {
              borderStyle: 'solid',
              borderRightWidth: 2,
              borderColor: "#d6d6d6"
            }]}>
              <Text style={styles.channelStatText}>Sendable: 42415 sats</Text>
            </View>
            <View style={styles.channelStat}>
              <Text style={styles.channelStatText}>Receivable: 42415 sats</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  channelItem: {
    width: "100%",
    backgroundColor: 'white'
  },
  channelDetails: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  channelIp: {
    color: "#6b6b6b"
  },
  channelName: {
    flexDirection: 'row',
    color: "#6b6b6b",
    alignItems: 'center'
  },
  channelStatus: {
    height: 20,
    width: 20,
    backgroundColor: "#39b54a",
    marginLeft: 10
  },
  transactionDetails: {
    flexDirection: "row",
    width: "50%"
  },
  transactionIcon: {
    marginRight: 15,
    width: 40,
    height: 40
  },
  transactionHashText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999999"
  },
  transactionValueText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6b6b6b"
  },
  transactionTime: {
    textAlign: "right",
    fontSize: 10
  }
});