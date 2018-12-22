import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

const Channels: React.FunctionComponent = () => (
  <View style={styles.container}>
    <Text>
      Coming soon
    </Text>
  </View>
)

Channels.navigationOptions = {
  title: 'Channels'
}

export default Channels

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E4674',
    flex: 1,
    justifyContent: 'center',
  }
})