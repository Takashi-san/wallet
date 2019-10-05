/**
 * @format
 */
import React from 'react'
import QRCode from 'react-native-qrcode-svg'
/**
 * @typedef {import('react-native-qrcode-svg').QRCodeProps} _QRCodeProps
 */

/**
 * @type {Record<'btc'|'shock', string>}
 */
const LOGO = {
  btc:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCgUPEjRzduhEAAABgElEQVRIx82VPSxDURTHf1Ui9ZF6OmDzMQhVS01CkDBZJBLpYJBIakMkJquJwWqSSGqQWFWiYkF0lEZiEDUQiY+kBtEocg309r547/W9voFzl/8975zfuR8v54KRbSAQRIAxBIItTK0Ml/b3gHKpAvilrgWgi2G6AaihkrdiqDWExfjgkm3G8ZYKyI8UHe7OIMQ+9eafvQzwKqstEybMEDPEdatYsq6RkIFRxTupABLWW3g3xMa4kNpvDTCzJ6kypQDa6ZF6zymghTmO8f3Mzli3Dt+Vh/XIFbdkdTdwiFasXrzIr3TKoDuA4JMpe4B5NDQCBJlgk5yCeKHBDiCq83fzrCCmnV4jpFhVZm3OAXBn5HQCGFH0jTmg2jDZzwoRZX6UF4WW5mERD030SU8/AHU0EqKXKiX9hPPfNZptdSSBIEOn0SJHbaYn9emFLQQtD1BwzzUHxEmahfjQ5IghEMzSygICwQ4VZmmFFWTJSv39BjyQJg1AzqRP8R+eNteAL3+b3x/9c2iUAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTEwLTA1VDE1OjE4OjUyKzAwOjAwRiopQwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0xMC0wNVQxNToxODo1MiswMDowMDd3kf8AAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
  shock: '',
}

/**
 * @typedef {object} _Props
 * @prop {'btc'|'shock'} logoToShow
 */

/**
 * @typedef {_Props & _QRCodeProps} Props
 */

/** @type {React.FC<Props>} */
const _QR = ({ logoToShow, ...otherProps }) => ((
  <QRCode
    {...otherProps}
    logo={{
      uri: LOGO[logoToShow],
    }}
  />
))

const QR = React.memo(_QR)

export default QR
