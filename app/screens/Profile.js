/**
 * @prettier
 */
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native'
import { Avatar, Divider, Icon } from 'react-native-elements'

import ShockButton from '../components/ShockButton'

import * as CSS from '../css'

import MAP_BACKGROUND from '../assets/images/mapworld_white.png'
import ShockModal from '../components/ShockModal'
import ShockInput from '../components/ShockInput'

const SAMPLE_IMAGE =
  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'

interface Product {
  id: string | number;
  name: string;
  price: number;
}

interface State {
  editProfile: boolean;
  products: Array<Product>;
  publicySearchable: boolean;
}

const PROFILE_DESCRIPTION_SAMPLE =
  'I am husband and father of two. I’m also an avid cryptotrader. Based in Toronto!'

const PROFILE_IMAGE_SAMPLE =
  'https://www.howtogeek.com/wp-content/uploads/2018/01/xshutterstock_530337757.jpg.pagespeed.gp+jp+jw+pj+ws+js+rj+rp+rw+ri+cp+md.ic.za_xAbvkPk.jpg'

export default class ShockProfile extends React.PureComponent<{}, State> {
  state = {
    biography: '',
    editProfile: true,
    products: [null, null, null, null],
    publicySearchable: false,
  }

  onPressEditProfile = () => {
    this.setState(prevState => ({
      editProfile: !prevState.editProfile,
    }))
  }

  onChangeTextBiography = (text: string) => {
    this.setState({
      biography: text,
    })
  }

  onSwitchPublicySearchable = () => {
    this.setState(prevState => ({
      publicySearchable: !prevState.publicySearchable,
    }))
  }
  render() {
    const { biography, editProfile, products, publicySearchable } = this.state
    return (
      <React.Fragment>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Image
              resizeMode="contain"
              source={MAP_BACKGROUND}
              style={styles.background}
              width="100%"
              height={200}
            />

            <View style={styles.avatarContainer}>
              <Avatar
                avatarStyle={styles.avatar}
                rounded
                xlarge
                source={{ uri: SAMPLE_IMAGE }}
              />
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.profileDescription}>
              {PROFILE_DESCRIPTION_SAMPLE}
            </Text>

            <View style={[styles.row, styles.actionContainer]}>
              <View style={styles.buttonContainer}>
                <ShockButton
                  // full
                  icon={{ type: 'font-awesome', name: 'bolt', size: 20 }}
                  title="Send"
                />
              </View>

              <View style={styles.buttonContainer}>
                <View style={styles.actionRequestContainer}>
                  <ShockButton color={CSS.Colors.BLUE_LIGHT} title="Request" />
                </View>
              </View>
            </View>

            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.actionContainer}>
              <ShockButton
                icon={{
                  type: 'font-awesome',
                  name: 'comment',
                }}
                title="Send Message"
                color={CSS.Colors.GRAY_DARK}
              />
            </View>
          </View>

          <View style={styles.dividerProductContainer}>
            <Divider style={styles.dividerProduct} />
          </View>

          <View style={styles.productHeaderTextContainer}>
            <Text style={styles.productHeaderText}>Products</Text>
          </View>

          <View style={[styles.row, styles.rowImageContainer]}>
            {products.length === 0 ? (
              <Text style={styles.noProductsText}>
                Doesn't have products available.
              </Text>
            ) : (
              <View style={styles.rowImage}>
                {products.map((product, i) => (
                  <View
                    style={i % 2 !== 0 ? styles.imageRight : styles.imageLeft}
                    key={i}
                  >
                    <TouchableOpacity>
                      <Image
                        style={styles.productImage}
                        source={{
                          uri:
                            'https://www.howtogeek.com/wp-content/uploads/2018/01/xshutterstock_530337757.jpg.pagespeed.gp+jp+jw+pj+ws+js+rj+rp+rw+ri+cp+md.ic.za_xAbvkPk.jpg',
                        }}
                      />
                    </TouchableOpacity>
                    <View style={styles.productNameContainer}>
                      <Text style={styles.produtName}>Example</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <ShockModal
          visible={editProfile}
          onRequestClose={this.onPressEditProfile}
        >
          <View style={styles.modalContentPadding}>
            <Text style={styles.modalInnerTextTitle}>Edit Identity</Text>
          </View>

          <View style={styles.modalContentPadding}>
            <Text
              style={[
                styles.modalInnerTextBold,
                styles.modalIdentityFieldPadding,
              ]}
            >
              Name
            </Text>
            <View style={styles.modalRow}>
              <Text style={[styles.modalInnerText]}>Michael Farrington</Text>
              <Icon
                name="pencil"
                type="font-awesome"
                color={CSS.Colors.ORANGE}
                size={14}
                iconStyle={styles.modalIcon}
              />
            </View>
          </View>

          <View style={styles.modalContentPadding}>
            <Text
              style={[
                styles.modalInnerTextBold,
                styles.modalIdentityFieldPadding,
              ]}
            >
              Email Address
            </Text>
            <View style={styles.modalRow}>
              <Text style={[styles.modalInnerText]}>michael473@gmail.com</Text>
              <Icon
                name="pencil"
                type="font-awesome"
                color={CSS.Colors.ORANGE}
                size={14}
                iconStyle={styles.modalIcon}
              />
            </View>
          </View>

          <View style={styles.modalContentPadding}>
            <Text
              style={[
                styles.modalInnerTextBold,
                styles.modalIdentityFieldPadding,
              ]}
            >
              Shipping Address
            </Text>
            <View style={styles.modalRow}>
              <Text style={[styles.modalInnerText]}>
                375 Dundas Street West, Toronto, ON
              </Text>
              <Icon
                name="pencil"
                type="font-awesome"
                color={CSS.Colors.ORANGE}
                size={14}
                iconStyle={styles.modalIcon}
              />
            </View>
          </View>

          <View
            style={[
              styles.modalContentPadding,
              styles.modalImageUploaderContainer,
            ]}
          >
            <View style={styles.modalRow}>
              <TouchableOpacity>
                <Avatar
                  avatarStyle={styles.modalAvatarImage}
                  medium
                  source={{ uri: SAMPLE_IMAGE }}
                  rounded
                />
              </TouchableOpacity>
              <Text style={styles.modalImageUploaderText}>Change Photo</Text>
            </View>
          </View>

          <View style={[styles.modalContentPadding, styles.modalInput]}>
            <ShockInput
              multiline
              numberOfLines={4}
              onChangeText={this.onChangeTextBiography}
              placeholder="Enter your bio"
              value={biography}
            />
          </View>

          <View style={styles.row}>
            <Text
              style={[
                styles.modalInnerTextBold,
                styles.modalIdentityFieldPadding,
              ]}
            >
              Make publicy searcheable
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.modalInnerText}>No</Text>
            <Switch
              value={publicySearchable}
              onValueChange={this.onSwitchPublicySearchable}
              style={styles.switch}
            />
            <Text style={styles.modalInnerText}>Yes</Text>
          </View>

          <ShockButton onPress={this.onPressEditProfile} />
        </ShockModal>
      </React.Fragment>
    )
  }
}

const BACKGROUND_MAX_HEIGHT = 180

const AVATAR_BORDER_WIDTH = 4
const AVATAR_PADDING_TOP = 100

const AVATAR_OFFSET = 100

const modalInnerTextStyle = {
  color: CSS.Colors.TEXT_STANDARD,
  fontSize: 26,
}

const styles = StyleSheet.create({
  avatar: {
    borderColor: CSS.Colors.TEXT_WHITE,
    borderWidth: 4,
    padding: 20,
  },

  actionContainer: {
    justifyContent: 'center',
  },

  actionRequestContainer: {
    paddingLeft: 10,
  },

  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowColor: 'black',
    shadowRadius: 8,
    position: 'absolute',
    bottom: -AVATAR_OFFSET,
  },

  buttonContainer: {
    flex: 1,
  },

  header: {
    alignItems: 'center',
    marginBottom: AVATAR_OFFSET * 1.2,
  },

  container: {
    flex: 1,
  },

  backgroundContainer: {
    marginLeft: -CSS.SCREEN_PADDING,
    marginRight: -CSS.SCREEN_PADDING,
  },

  background: {
    backgroundColor: CSS.Colors.BLUE_DARK,
  },

  contentContainer: {
    paddingLeft: CSS.SCREEN_PADDING,
    paddingRight: CSS.SCREEN_PADDING,
  },

  divider: {
    height: 2,
    backgroundColor: CSS.Colors.GRAY_MEDIUM,
  },

  dividerContainer: {
    justifyContent: 'center',
    marginLeft: -CSS.SCREEN_PADDING,
    marginRight: -CSS.SCREEN_PADDING,
    marginBottom: 20,
  },

  dividerProduct: {
    height: 1.5,
    backgroundColor: CSS.Colors.GRAY_DARK,
    marginTop: 50,
  },

  dividerProductContainer: {
    marginLeft: -CSS.SCREEN_PADDING,
    marginRight: -CSS.SCREEN_PADDING,
  },

  imageContainer: {
    padding: '40%',
  },

  imageRight: {
    marginLeft: 10,
  },

  imageLeft: {
    marginRight: 5,
  },

  noProductsText: {
    fontSize: 16,
    color: CSS.Colors.TEXT_STANDARD,
    marginTop: 10,
    marginLeft: CSS.SCREEN_PADDING,
  },

  modalContentPadding: {
    paddingBottom: 20,
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

  modalIdentityFieldPadding: {
    marginBottom: 5,
  },

  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalImageUploaderContainer: {
    borderStyle: 'dashed',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: CSS.Colors.TEXT_LIGHT,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
  },

  modalImageUploaderText: {
    color: CSS.Colors.TEXT_LIGHT,
    paddingLeft: 10,
    fontSize: 16,
  },

  modalAvatarImage: {
    borderColor: CSS.Colors.ORANGE,
    borderWidth: 3,
    padding: 20,
  },

  modalIcon: {
    paddingLeft: 4,
  },

  modalInput: {
    height: 100,
  },

  productHeaderTextContainer: {
    paddingTop: 20,
    paddingLeft: CSS.SCREEN_PADDING,
  },

  productHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: CSS.Colors.TEXT_STANDARD,
  },

  productImage: {
    width: 150,
    height: 100,
    borderRadius: 5,
  },

  produtName: {
    textAlign: 'center',
    fontSize: 14,
    color: CSS.Colors.TEXT_LIGHT,
  },

  productNameContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },

  profileHeaderContainer: {
    textAlign: 'center',
  },

  profileDescription: {
    color: CSS.Colors.TEXT_LIGHT,
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  rowImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  rowImageContainer: {
    paddingTop: 30,
    paddingLeft: CSS.SCREEN_PADDING,
    paddingRight: CSS.SCREEN_PADDING,
  },

  switch: {
    marginLeft: 5,
    marginRight: 5,
  },
})
