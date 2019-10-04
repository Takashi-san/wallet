import React from 'react'
import { View } from 'react-native'

/**
 * @typedef {object} Props
 * @prop {number} amount
 */

/**
 * @type {React.FC<Props>}
 */
const _Pad = ({ amount }) => <View style={{
  marginBottom: (amount / 2),
  marginTop: (amount / 2)
}}>
</View>


const Pad = React.memo(_Pad)

export default Pad