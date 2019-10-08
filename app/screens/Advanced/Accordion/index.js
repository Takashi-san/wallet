import React, { Component, Fragment } from "react";
import { View, Text, StyleSheet, TouchableHighlight, ScrollView, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Entypo";

export default class Accordion extends Component {
  state = {
    open: false,
    menuOpen: false
  };

  componentDidMount() {
    const { open } = this.props;
    this.setState({
      open
    });
  }

  toggleMenuOpen = () => {
    const { menuOpen } = this.state;
    this.setState({
      menuOpen: !menuOpen
    })
  }

  renderTRXMenu = () => {
    const { title, open } = this.props;
    const { menuOpen } = this.state;
    const supportedAccordions = ['transactions'];
    if (open && supportedAccordions.includes(title.toLowerCase())) {
      return (
        <View style={styles.accordionMenu}>
          <View style={[styles.accordionMenuItem, {
            opacity: menuOpen ? 1 : 0
          }]}>
            <View style={styles.accordionMenuItemIcon}>
              <Icon name="link" size={20} color="#294f93" />
            </View>
            <Text style={styles.accordionMenuItemText}>Generate</Text>
          </View>
          <View style={[styles.accordionMenuItem, {
            opacity: menuOpen ? 1 : 0
          }]}>
            <View style={styles.accordionMenuItemIcon}>
              <Icon name="flash" size={20} color="#294f93" />
            </View>
            <Text style={styles.accordionMenuItemText}>Send</Text>
          </View>
          <TouchableOpacity style={styles.accordionMenuBtn} onPress={this.toggleMenuOpen}>
            <Icon name="plus" size={30} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
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
        {this.renderTRXMenu()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accordionItem: {
    width: "100%"
  },
  accordionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    borderStyle: "solid"
  },
  accordionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  accordionMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10
  },
  accordionMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingRight: 20,
    borderRadius: 100,
    backgroundColor: 'white',
    marginRight: 15,
    elevation: 3
  },
  accordionMenuItemIcon: {
    marginRight: 10
  },
  accordionMenuItemText: {
    color: "#294f93",
    fontWeight: 'bold'
  },
  accordionMenuBtn: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: "#f5a623",
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  }
});