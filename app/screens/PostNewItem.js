/**
 * @prettier
 */
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Dimensions,
} from 'react-native'
import { Divider, Icon, Button } from 'react-native-elements'

import { Colors } from '../css/index'
import ShockButton from '../components/ShockButton'
import ShockInput from '../components/ShockInput'

// TODO: Find out why Price Container isn't sticking to bottom of parent

const INPUT_PADDING_LEFT = 16
const ICON_SIZE = 36

interface State {
  amountOfPhotos: number;
  itemName: string;
  itemDescription: string;
  itemPrice: string;
}

export default class PostNewItem extends React.PureComponent<{}, State> {
  state = {
    amountOfPhotos: 0,
    itemName: '',
    itemDescription: '',
    itemPrice: '',
  }

  onChangeItemName = (text: string) => {
    this.setState({
      itemName: text,
    })
  }

  onChangeItemDescription = (text: string) => {
    this.setState({
      itemDescription: text,
    })
  }

  onChangeItemPrice = (text: string) => {
    this.setState(({ itemPrice }) => ({
      itemPrice: /^[0-9]+$/.test(text) ? text : itemPrice,
    }))
  }

  onPressAddPhotoCamera = () => {
    this.setState({
      amountOfPhotos: 1,
    })
  }

  onPressAddPhotoPaperClip = () => {}

  render() {
    const { amountOfPhotos, itemDescription, itemName, itemPrice } = this.state

    const disableSubmitBtn =
      amountOfPhotos === 0 ||
      itemDescription.length === 0 ||
      itemName.length === 0 ||
      itemPrice.length === 0

    return (
      <View style={styles.container}>
        <View style={styles.textInputs}>
          <View style={[styles.inputName, styles.inputMargin]}>
            <ShockInput
              onChangeText={this.onChangeItemName}
              paddingLeft={INPUT_PADDING_LEFT}
              placeholder="Item Name"
              value={itemName}
            />
          </View>
          <View style={[styles.inputDescription, styles.inputMargin]}>
            <ShockInput
              multiline
              numberOfLines={4}
              onChangeText={this.onChangeItemDescription}
              paddingLeft={INPUT_PADDING_LEFT}
              placeholder="Write a description about this item"
              value={itemDescription}
            />
          </View>
          <View style={[styles.containerPrice, styles.inputMargin]}>
            <ShockInput
              onChangeText={this.onChangeItemPrice}
              paddingLeft={INPUT_PADDING_LEFT}
              placeholder="Item Price"
              value={itemPrice}
            />
            <View style={styles.bitsContainer}>
              <Text style={styles.bitsText}>SATS</Text>
            </View>
          </View>
        </View>

        <View style={styles.dividerContainer}>
          <Divider style={[styles.divider]} />
        </View>

        <View style={styles.addPhotoAndButton}>
          <View style={styles.addPhotoContainer}>
            <Text style={styles.addPhotoText}>Add a Photo</Text>

            <View style={styles.iconContainer}>
              <Icon
                color={Colors.ORANGE}
                iconStyle={styles.icon}
                name="camera"
                onPress={this.onPressAddPhotoCamera}
                size={ICON_SIZE}
                type="entypo"
              />
              <Icon
                color={Colors.ORANGE}
                iconStyle={styles.icon}
                name="paperclip"
                onPress={this.onPressAddPhotoPaperClip}
                size={ICON_SIZE}
                type="font-awesome"
              />
            </View>
          </View>

          <ShockButton disabled={disableSubmitBtn} title="Submit Listing" />
        </View>
      </View>
    )
  }
}

const INPUT_BORDER_RADIUS = 5
const INPUT_BORDER_WIDTH = 1
const INPUT_MARGIN_BOTTOM = 20

const INPUT_MAX_HEIGHT = 60

const styles = StyleSheet.create({
  addPhotoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  addPhotoContainer: {
    alignItems: 'flex-start',
    flex: 2,
  },

  bitsContainer: {
    justifyContent: 'center',
    paddingRight: 52,
    paddingLeft: 10,
  },

  bitsText: {
    color: Colors.BLUE_DARK,
    fontSize: 16,
    fontWeight: 'bold',
  },

  container: {
    justifyContent: 'space-between',
    flex: 1,
    padding: 30,
  },

  containerPrice: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    maxHeight: INPUT_MAX_HEIGHT,
  },

  divider: {
    backgroundColor: Colors.GRAY_MEDIUM,
    height: 2,
  },

  dividerContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
  },

  icon: {
    width: 60,
  },

  iconContainer: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  inputName: {
    flex: 1,
    maxHeight: 60,
  },

  inputDescription: {
    maxHeight: 180,
    flex: 3,
  },

  inputMargin: {
    marginBottom: INPUT_MARGIN_BOTTOM,
  },

  inputPrice: {
    flex: 3, // horizontal flex
  },

  textInputs: {
    flex: 5,
    justifyContent: 'space-between',
  },

  addPhotoAndButton: {
    flex: 2,
    justifyContent: 'space-between',
  },
})
