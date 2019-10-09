/**
 * @prettier
 */
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'

import moment from 'moment'

import { Colors } from '../../css'

/**
 * @typedef {object} Props
 * @prop {number|undefined} amount
 * @prop {string} id
 * @prop {boolean|undefined} isPaid
 * @prop {((id: string) => void)=} onPress
 * @prop {boolean=} outgoing
 * @prop {string} senderName
 * @prop {number} timestamp
 */

/**
 * @augments React.PureComponent<Props>
 */
export default class ChatMessage extends React.PureComponent {
  componentDidMount() {
    /**
     * Force-updates every minute so moment-formatted dates refresh.
     */
    this.intervalID = setInterval(() => {
      this.forceUpdate()
    }, 60000)
  }

  componentWillUnmount() {
    typeof this.intervalID === 'number' && clearInterval(this.intervalID)
  }

  onPress = () => {
    const { id, onPress } = this.props

    onPress && onPress(id)
  }

  renderPaymentStatus() {
    const { amount, isPaid, outgoing } = this.props

    if (typeof amount === 'undefined' || typeof isPaid === 'undefined') {
      return <ActivityIndicator />
    }

    return (
      <View>
        <Text style={styles.body}>{'$' + amount}</Text>
        {!outgoing && !isPaid && <Text>Press here to Pay</Text>}
        {isPaid && <Entypo name="check" />}
      </View>
    )
  }

  render() {
    const { outgoing, senderName, timestamp } = this.props

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={outgoing ? styles.container : styles.containerOutgoing}>
          <Text style={outgoing ? styles.name : styles.nameOutgoing}>
            {senderName}
          </Text>

          <Text style={styles.timestamp}>{moment(timestamp).fromNow()}</Text>

          <View style={[styles.row, styles.alignItemsCenter]}>
            <Entypo color={Colors.BLUE_DARK} name="text-document" size={32} />
            {this.renderPaymentStatus()}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const name = {
  color: Colors.BLUE_DARK,
  fontSize: 14,
  fontWeight: 'bold',
}

const CONTAINER_HORIZONTAL_PADDING = 12
const CONTAINER_VERTICAL_PADDING = 18

const container = {
  alignItems: 'flex-start',
  backgroundColor: Colors.BLUE_LIGHTEST,
  borderRadius: 10,
  justifyContent: 'center',
  margin: 15,
  paddingBottom: CONTAINER_VERTICAL_PADDING,
  paddingLeft: CONTAINER_HORIZONTAL_PADDING,
  paddingRight: CONTAINER_HORIZONTAL_PADDING,
  paddingTop: CONTAINER_VERTICAL_PADDING,
}

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },

  body: {
    color: Colors.TEXT_STANDARD,
    fontSize: 15,
    marginTop: 8,
  },
  container,
  containerOutgoing: {
    ...container,
    backgroundColor: Colors.GRAY_MEDIUM,
  },
  name,
  nameOutgoing: {
    ...name,
    color: Colors.TEXT_STANDARD,
  },

  row: {
    flexDirection: 'row',
  },

  timestamp: {
    fontSize: 12,
    color: Colors.TEXT_LIGHT,
  },
})
