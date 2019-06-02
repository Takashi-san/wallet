/**
 * @prettier
 */
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  SafeAreaView,
  Switch,
  TextInput,
} from 'react-native'
import { Divider } from 'react-native-elements'

import ShockButton from '../components/ShockButton'
import ShockModal from '../components/ShockModal'
import UserDetail from '../components/UserDetail'
import Carousel from 'react-native-smart-carousel'
import ShockInput from '../components/ShockInput'

import Example from '../assets/images/mapworld_white.png'

import * as CSS from '../css'

const dummyData = [
  {
    id: 0,
    title: '',
    imagePath:
      'https://images-na.ssl-images-amazon.com/images/I/61YVqHdFRxL._SL1322_.jpg',
  },
  {
    id: 1,
    title: '',
    imagePath:
      'https://cdn-images-1.medium.com/max/1600/1*yWS1bEU6aoaXYHCUm2L2Rg.png',
  },
]

interface State {
  messageForSeller: string;
  modalVisibility: boolean;
  shareEmailAddress: boolean;
  shareShippingAddress: boolean;
}

class ListingDetail extends React.PureComponent<{}, State> {
  state = {
    modalVisibility: false,
    shareShippingAddress: false,
    shareEmailAddress: false,
    messageForSeller: '',
  }

  onChangeMessageForSeller = (text: string) => {
    this.setState({
      messageForSeller: text,
    })
  }

  onPressBuyNow = () => {
    this.setState(prevState => ({
      modalVisibility: !prevState.modalVisibility,
    }))
  }

  onSwitchShareShippingAddress = () => {
    this.setState(prevState => ({
      shareShippingAddress: !prevState.shareShippingAddress,
    }))
  }

  onSwitchShareEmailAddress = () => {
    this.setState(prevState => ({
      shareEmailAddress: !prevState.shareEmailAddress,
    }))
  }

  render() {
    const {
      messageForSeller,
      modalVisibility,
      shareShippingAddress,
      shareEmailAddress,
    } = this.state

    return (
      <React.Fragment>
        <View style={styles.container}>
          <ScrollView
            style={[styles.contentContainer, styles.carouselContainer]}
            ref={carouselRef => (this.parentScrollView = carouselRef)}
          >
            <Carousel
              navigation
              height={240}
              navigationColor={CSS.Colors.TEXT_WHITE}
              data={dummyData}
              autoPlay
            />
            <View style={styles.previewContainer}>
              <Text style={styles.title}>Samsung Galaxy S10</Text>
              <Text style={styles.body}>Lightly used. Still new in box.</Text>
            </View>
          </ScrollView>

          <View style={styles.actionsContainer}>
            <View style={styles.flexContainer}>
              <UserDetail nameBold title="Seller" name="Matt Thompson" />
            </View>

            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.flexContainer}>
              <ShockButton
                icon={{
                  name: 'comment',
                  type: 'font-awesome',
                }}
                title="Send message"
              />
            </View>

            <View style={styles.flexContainer}>
              <ShockButton
                onPress={this.onPressBuyNow}
                color={CSS.Colors.BLUE_LIGHT}
                title="Buy Now for 53,281 Bits"
              />
            </View>
          </View>
        </View>

        <ShockModal
          onRequestClose={() => this.setState({ modalVisibility: false })}
          visible={modalVisibility}
        >
          <View style={styles.modalContentPadding}>
            <Text style={styles.modalInnerTextTitle}>Purchase</Text>
          </View>
          <View style={styles.modalContentPadding}>
            <Text style={styles.modalInnerTextBold}>Price</Text>
            <Text style={styles.modalInnerText}>53,281 Bits</Text>
          </View>
          <View style={[styles.modalContentPadding]}>
            <Text style={styles.modalInnerTextBold}>
              Share your shipping address?
            </Text>
            <View style={styles.row}>
              <Text style={styles.modalInnerText}>No</Text>
              <Switch
                onValueChange={this.onSwitchShareShippingAddress}
                value={shareShippingAddress}
                style={styles.switch}
              />
              <Text style={styles.modalInnerText}>Yes</Text>
            </View>
          </View>
          <View style={styles.modalContentPadding}>
            <Text style={styles.modalInnerTextBold}>
              Share your email address?
            </Text>
            <View style={styles.row}>
              <Text style={styles.modalInnerText}>No</Text>
              <Switch
                onValueChange={this.onSwitchShareEmailAddress}
                style={styles.switch}
                value={shareEmailAddress}
              />
              <Text style={styles.modalInnerText}>Yes</Text>
            </View>
          </View>
          <View
            style={[styles.modalContentPadding, styles.addMessageContainer]}
          >
            <ShockInput
              multiline
              numberOfLines={4}
              onChangeText={this.onChangeMessageForSeller}
              placeholder="Enter a message for the seller (optional)"
              value={messageForSeller}
            />
          </View>
          <ShockButton
            onPress={() => {
              this.setState({
                modalVisibility: false,
              })
            }}
            title="Submit Order"
          />

          <Text
            style={[styles.closeModalContainer, styles.closeModalText]}
            onPress={() => {
              this.setState({
                modalVisibility: false,
              })
            }}
          >
            CLOSE
          </Text>
        </ShockModal>
      </React.Fragment>
    )
  }
}

const modalInnerTextStyle = {
  color: CSS.Colors.TEXT_STANDARD,
  fontSize: 26,
}

const styles = StyleSheet.create({
  actionsContainer: {
    flex: 0.4,
  },

  addMessageContainer: {
    height: 120,
  },

  body: {
    color: CSS.Colors.TEXT_STANDARD,
    fontSize: 14,
    marginTop: 8,
  },

  carouselContainer: {
    marginRight: -CSS.SCREEN_PADDING,
    marginLeft: -CSS.SCREEN_PADDING,
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: CSS.SCREEN_PADDING,
    paddingRight: CSS.SCREEN_PADDING,
  },

  contentContainer: {
    flex: 1,
  },

  closeModalContainer: {
    paddingTop: 30,
    paddingRight: 30,
    paddingLeft: 30,
    textAlign: 'center',
  },

  closeModalText: {
    color: CSS.Colors.ORANGE,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  dividerContainer: {
    flex: 0.3,
    marginLeft: -CSS.SCREEN_PADDING,
    marginRight: -CSS.SCREEN_PADDING,
  },

  divider: {
    backgroundColor: CSS.Colors.GRAY_MEDIUM,
    height: 2,
  },

  flexContainer: {
    flex: 1,
  },

  modalContentPadding: {
    paddingBottom: 20,
  },

  modalInnerContainer: {
    height: 300,
    justifyContent: 'space-between',
  },

  modalInnerTextTitle: {
    ...modalInnerTextStyle,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalInnerText: {
    color: CSS.Colors.TEXT_LIGHT,
    fontSize: 14,
  },

  modalInnerTextBold: {
    ...modalInnerTextStyle,
    fontWeight: 'bold',
    fontSize: 16,
    color: CSS.Colors.TEXT_STANDARD,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  previewContainer: {
    paddingLeft: CSS.SCREEN_PADDING,
    paddingRight: CSS.SCREEN_PADDING,
  },

  purchaseOptionsContainer: {
    flex: 3,
  },

  textContainer: {
    alignItems: 'center',
    flex: 0.5,
    justifyContent: 'center',
  },

  title: {
    color: CSS.Colors.TEXT_STANDARD,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },

  switch: {
    marginLeft: 5,
    marginRight: 5,
  },
})

export default ListingDetail
