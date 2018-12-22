import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

const NodeControls: React.FunctionComponent = () => (
  <View style={styles.container}>
    <Text>
      Coming soon
    </Text>
  </View>
)

NodeControls.navigationOptions = {
  title: 'Node Controls'
}

export default NodeControls

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E4674',
    flex: 1,
    justifyContent: 'center',
  }
})