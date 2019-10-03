import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight, ScrollView, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default class Accordion extends Component {
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
    const { title, children, open, toggleAccordion } = this.props;
    return (
      <View style={[styles.accordionItem, { flex: open ? 1 : 0 }]}>
        <TouchableOpacity onPress={toggleAccordion} style={styles.accordionItem}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={open ? ["#F5A623", "#F5A623"] : ["#194B93", "#4285B9"] } style={styles.accordionHeader}>
            <Text style={styles.accordionHeaderText}>
              {title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <ScrollView style={{
          height: open ? "100%" : "0%"
        }}>
          {children}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accordionItem: {
    width: "100%"
  },
  accordionHeader: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    borderStyle: "solid"
  },
  accordionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  }
});